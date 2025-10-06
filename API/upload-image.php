<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);

try {
    require_once 'config.php';
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Config error: ' . $e->getMessage()
    ]);
    exit;
}

// Check if uploads directory exists, create if not
if (!file_exists(UPLOAD_DIR)) {
    mkdir(UPLOAD_DIR, 0755, true);
}

// Create subdirectories for organization
$subdirs = ['properties', 'projects', 'users', 'temp'];
foreach ($subdirs as $subdir) {
    $path = UPLOAD_DIR . $subdir;
    if (!file_exists($path)) {
        mkdir($path, 0755, true);
    }
}

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Only POST method allowed');
    }
    
    if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
        throw new Exception('No file uploaded or upload error occurred');
    }
    
    $file = $_FILES['image'];
    $uploadType = $_POST['type'] ?? 'temp'; // properties, projects, users, temp
    $propertyId = $_POST['property_id'] ?? null;
    
    // Validate file size
    if ($file['size'] > MAX_FILE_SIZE) {
        throw new Exception('File size exceeds maximum allowed size of ' . (MAX_FILE_SIZE / 1024 / 1024) . 'MB');
    }
    
    // Validate file type
    $fileInfo = pathinfo($file['name']);
    $extension = strtolower($fileInfo['extension']);
    
    if (!in_array($extension, ALLOWED_EXTENSIONS)) {
        throw new Exception('File type not allowed. Allowed types: ' . implode(', ', ALLOWED_EXTENSIONS));
    }
    
    // Validate image
    $imageInfo = getimagesize($file['tmp_name']);
    if ($imageInfo === false) {
        throw new Exception('File is not a valid image');
    }
    
    // Generate unique filename
    $filename = uniqid() . '_' . time() . '.' . $extension;
    $uploadPath = UPLOAD_DIR . $uploadType . '/' . $filename;
    $relativePath = 'uploads/' . $uploadType . '/' . $filename;
    
    // Move uploaded file
    if (!move_uploaded_file($file['tmp_name'], $uploadPath)) {
        throw new Exception('Failed to move uploaded file');
    }
    
    // Create thumbnail for images
    $thumbnailPath = null;
    if (in_array($extension, ['jpg', 'jpeg', 'png', 'gif'])) {
        $thumbnailPath = createThumbnail($uploadPath, $uploadType, $filename);
    }
    
    // Store image info for response
    $imageId = null;
    
    echo json_encode([
        'success' => true,
        'message' => 'Image uploaded successfully',
        'data' => [
            'id' => $imageId ?? null,
            'filename' => $filename,
            'url' => $relativePath,
            'thumbnail_url' => $thumbnailPath,
            'size' => $file['size'],
            'type' => $imageInfo['mime'],
            'dimensions' => [
                'width' => $imageInfo[0],
                'height' => $imageInfo[1]
            ]
        ]
    ]);
    
} catch (Exception $e) {
    error_log('Image upload error: ' . $e->getMessage());
    
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
} catch (Throwable $e) {
    // Catch any other errors that might occur
    error_log('Image upload fatal error: ' . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Fatal error: ' . $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine()
    ]);
}

function createThumbnail($sourcePath, $uploadType, $filename) {
    try {
        // Check if GD extension is loaded
        if (!extension_loaded('gd')) {
            error_log('GD extension not loaded - skipping thumbnail creation');
            return null;
        }
        
        // Check if required GD functions exist
        if (!function_exists('imagecreatefromjpeg') || !function_exists('imagecreatetruecolor')) {
            error_log('Required GD functions not available - skipping thumbnail creation');
            return null;
        }
        
        $thumbnailDir = UPLOAD_DIR . $uploadType . '/thumbnails/';
        if (!file_exists($thumbnailDir)) {
            mkdir($thumbnailDir, 0755, true);
        }
        
        $thumbnailPath = $thumbnailDir . 'thumb_' . $filename;
        $thumbnailRelativePath = 'uploads/' . $uploadType . '/thumbnails/thumb_' . $filename;
        
        // Get image info
        $imageInfo = getimagesize($sourcePath);
        if ($imageInfo === false) {
            error_log('Could not get image info for: ' . $sourcePath);
            return null;
        }
        
        $sourceWidth = $imageInfo[0];
        $sourceHeight = $imageInfo[1];
        $mimeType = $imageInfo['mime'];
        
        // Calculate thumbnail dimensions (max 300x300, maintain aspect ratio)
        $maxSize = 300;
        if ($sourceWidth > $sourceHeight) {
            $thumbWidth = $maxSize;
            $thumbHeight = intval($sourceHeight * $maxSize / $sourceWidth);
        } else {
            $thumbHeight = $maxSize;
            $thumbWidth = intval($sourceWidth * $maxSize / $sourceHeight);
        }
        
        // Create source image resource
        $sourceImage = null;
        switch ($mimeType) {
            case 'image/jpeg':
                if (function_exists('imagecreatefromjpeg')) {
                    $sourceImage = imagecreatefromjpeg($sourcePath);
                }
                break;
            case 'image/png':
                if (function_exists('imagecreatefrompng')) {
                    $sourceImage = imagecreatefrompng($sourcePath);
                }
                break;
            case 'image/gif':
                if (function_exists('imagecreatefromgif')) {
                    $sourceImage = imagecreatefromgif($sourcePath);
                }
                break;
            default:
                error_log('Unsupported image type: ' . $mimeType);
                return null;
        }
        
        if ($sourceImage === null || $sourceImage === false) {
            error_log('Failed to create source image from: ' . $sourcePath);
            return null;
        }
        
        // Create thumbnail image
        $thumbnailImage = imagecreatetruecolor($thumbWidth, $thumbHeight);
        if ($thumbnailImage === false) {
            imagedestroy($sourceImage);
            error_log('Failed to create thumbnail canvas');
            return null;
        }
        
        // Preserve transparency for PNG and GIF
        if ($mimeType === 'image/png' || $mimeType === 'image/gif') {
            imagealphablending($thumbnailImage, false);
            imagesavealpha($thumbnailImage, true);
            $transparent = imagecolorallocatealpha($thumbnailImage, 255, 255, 255, 127);
            imagefilledrectangle($thumbnailImage, 0, 0, $thumbWidth, $thumbHeight, $transparent);
        }
        
        // Resize image
        $resizeResult = imagecopyresampled($thumbnailImage, $sourceImage, 0, 0, 0, 0, $thumbWidth, $thumbHeight, $sourceWidth, $sourceHeight);
        if (!$resizeResult) {
            imagedestroy($sourceImage);
            imagedestroy($thumbnailImage);
            error_log('Failed to resize image');
            return null;
        }
        
        // Save thumbnail
        $saveResult = false;
        switch ($mimeType) {
            case 'image/jpeg':
                if (function_exists('imagejpeg')) {
                    $saveResult = imagejpeg($thumbnailImage, $thumbnailPath, 85);
                }
                break;
            case 'image/png':
                if (function_exists('imagepng')) {
                    $saveResult = imagepng($thumbnailImage, $thumbnailPath, 8);
                }
                break;
            case 'image/gif':
                if (function_exists('imagegif')) {
                    $saveResult = imagegif($thumbnailImage, $thumbnailPath);
                }
                break;
        }
        
        // Clean up memory
        imagedestroy($sourceImage);
        imagedestroy($thumbnailImage);
        
        if (!$saveResult) {
            error_log('Failed to save thumbnail: ' . $thumbnailPath);
            return null;
        }
        
        return $thumbnailRelativePath;
        
    } catch (Exception $e) {
        error_log('Thumbnail creation error: ' . $e->getMessage() . ' - Source: ' . $sourcePath);
        return null;
    }
}
?>