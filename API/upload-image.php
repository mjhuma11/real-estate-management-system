<?php
require_once 'config.php';

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
    
    // If this is for a property, save to database
    if ($uploadType === 'properties' && $propertyId) {
        $stmt = $conn->prepare("INSERT INTO property_images (property_id, image_url, thumbnail_url, filename, file_size, sort_order) VALUES (?, ?, ?, ?, ?, ?)");
        
        // Get next sort order
        $sortStmt = $conn->prepare("SELECT COALESCE(MAX(sort_order), 0) + 1 as next_order FROM property_images WHERE property_id = ?");
        $sortStmt->execute([$propertyId]);
        $sortOrder = $sortStmt->fetch()['next_order'];
        
        $stmt->execute([
            $propertyId,
            $relativePath,
            $thumbnailPath,
            $filename,
            $file['size'],
            $sortOrder
        ]);
        
        $imageId = $conn->lastInsertId();
    }
    
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
    logError('Image upload error', [
        'error' => $e->getMessage(),
        'file_info' => $_FILES['image'] ?? null,
        'post_data' => $_POST
    ]);
    
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

function createThumbnail($sourcePath, $uploadType, $filename) {
    try {
        $thumbnailDir = UPLOAD_DIR . $uploadType . '/thumbnails/';
        if (!file_exists($thumbnailDir)) {
            mkdir($thumbnailDir, 0755, true);
        }
        
        $thumbnailPath = $thumbnailDir . 'thumb_' . $filename;
        $thumbnailRelativePath = 'uploads/' . $uploadType . '/thumbnails/thumb_' . $filename;
        
        // Get image info
        $imageInfo = getimagesize($sourcePath);
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
        switch ($mimeType) {
            case 'image/jpeg':
                $sourceImage = imagecreatefromjpeg($sourcePath);
                break;
            case 'image/png':
                $sourceImage = imagecreatefrompng($sourcePath);
                break;
            case 'image/gif':
                $sourceImage = imagecreatefromgif($sourcePath);
                break;
            default:
                return null;
        }
        
        // Create thumbnail image
        $thumbnailImage = imagecreatetruecolor($thumbWidth, $thumbHeight);
        
        // Preserve transparency for PNG and GIF
        if ($mimeType === 'image/png' || $mimeType === 'image/gif') {
            imagealphablending($thumbnailImage, false);
            imagesavealpha($thumbnailImage, true);
            $transparent = imagecolorallocatealpha($thumbnailImage, 255, 255, 255, 127);
            imagefilledrectangle($thumbnailImage, 0, 0, $thumbWidth, $thumbHeight, $transparent);
        }
        
        // Resize image
        imagecopyresampled($thumbnailImage, $sourceImage, 0, 0, 0, 0, $thumbWidth, $thumbHeight, $sourceWidth, $sourceHeight);
        
        // Save thumbnail
        switch ($mimeType) {
            case 'image/jpeg':
                imagejpeg($thumbnailImage, $thumbnailPath, 85);
                break;
            case 'image/png':
                imagepng($thumbnailImage, $thumbnailPath, 8);
                break;
            case 'image/gif':
                imagegif($thumbnailImage, $thumbnailPath);
                break;
        }
        
        // Clean up memory
        imagedestroy($sourceImage);
        imagedestroy($thumbnailImage);
        
        return $thumbnailRelativePath;
        
    } catch (Exception $e) {
        logError('Thumbnail creation error', ['error' => $e->getMessage(), 'source' => $sourcePath]);
        return null;
    }
}
?>