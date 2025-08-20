import * as ImageManipulator from "expo-image-manipulator";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "../firebase/firebase";

// Test function to check Firebase Storage connectivity
async function testFirebaseStorage() {
  try {
    console.log("Testing Firebase Storage connectivity...");
    const testRef = ref(storage, "test");
    await listAll(testRef);
    console.log("Firebase Storage is accessible");
    return true;
  } catch (error) {
    console.error("Firebase Storage test failed:", error);
    return false;
  }
}

async function compressImage(uri) {
  try {
    console.log("Compressing image:", uri);
    
    // Check if ImageManipulator is available (mobile platforms)
    if (ImageManipulator && ImageManipulator.manipulateAsync) {
      // resize and compress to keep under a few hundred KB
      const result = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 1280 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );
      console.log("Image compressed successfully:", result.uri);
      return result.uri;
    } else {
      console.log("ImageManipulator not available, using original URI");
      return uri; // Return original URI on web or if ImageManipulator fails
    }
  } catch (error) {
    console.error("Error compressing image:", error);
    console.log("Falling back to original URI");
    return uri; // Return original URI if compression fails
  }
}

// Alternative upload method using XMLHttpRequest
async function uploadWithXHR(uri, storageRef) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;
        console.log(`Upload progress: ${percentComplete.toFixed(2)}%`);
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status === 200) {
        resolve(xhr.response);
      } else {
        reject(new Error(`Upload failed with status: ${xhr.status}`));
      }
    });

    xhr.addEventListener("error", () => {
      reject(new Error("Upload failed"));
    });

    xhr.addEventListener("abort", () => {
      reject(new Error("Upload aborted"));
    });

    xhr.open(
      "POST",
      `https://firebasestorage.googleapis.com/v0/b/${storageRef.bucket}/o?name=${storageRef.fullPath}`
    );
    xhr.setRequestHeader("Content-Type", "image/jpeg");

    // Convert URI to blob
    fetch(uri)
      .then((response) => response.blob())
      .then((blob) => {
        xhr.send(blob);
      })
      .catch(reject);
  });
}

async function uploadImageAndGetUrl(localUri, complaintId) {
  try {
    console.log("Starting image upload process...");
    console.log("Local URI:", localUri);

    // Test Firebase Storage connectivity first
    const isAccessible = await testFirebaseStorage();
    if (!isAccessible) {
      throw new Error("Firebase Storage is not accessible");
    }

    const compressedUri = await compressImage(localUri);
    console.log("Image compressed, new URI:", compressedUri);

    const response = await fetch(compressedUri);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }

    const blob = await response.blob();
    console.log("Blob created, size:", blob.size, "type:", blob.type);

    // Validate blob
    if (blob.size === 0) {
      throw new Error("Image file is empty or corrupted");
    }

    if (blob.size > 5 * 1024 * 1024) { // 5MB limit
      throw new Error("Image file is too large (max 5MB)");
    }

    const storageRef = ref(storage, `complaints/${complaintId}_${Date.now()}.jpg`);
    console.log("Storage reference created, uploading...");

    const uploadResult = await uploadBytes(storageRef, blob, {
      contentType: "image/jpeg",
    });
    console.log("Upload completed, getting download URL...");

    const downloadURL = await getDownloadURL(uploadResult.ref);
    console.log("Download URL obtained:", downloadURL);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    console.error("Error details:", error.code, error.message);

    // Check if it's a CORS error
    if (error.message.includes("CORS") || error.message.includes("preflight")) {
      console.log("CORS error detected, trying alternative method...");
      try {
        const compressedUri = await compressImage(localUri);
        const storageRef = ref(storage, `complaints/${complaintId}_${Date.now()}.jpg`);
        await uploadWithXHR(compressedUri, storageRef);
        const downloadURL = await getDownloadURL(storageRef);
        console.log("Alternative upload successful:", downloadURL);
        return downloadURL;
      } catch (altError) {
        console.error("Alternative upload also failed:", altError);
        throw new Error(
          "مشكلة في إعدادات Firebase Storage. يرجى التحقق من إعدادات CORS."
        );
      }
    }

    // Handle specific Firebase errors
    if (error.code === 'storage/unauthorized') {
      throw new Error("غير مصرح برفع الملفات. يرجى التحقق من صلاحيات Firebase Storage.");
    }
    
    if (error.code === 'storage/canceled') {
      throw new Error("تم إلغاء رفع الصورة.");
    }
    
    if (error.code === 'storage/unknown') {
      throw new Error("حدث خطأ غير معروف أثناء رفع الصورة.");
    }

    throw new Error(`فشل في رفع الصورة: ${error.message}`);
  }
}

async function uploadVideoAndGetUrl(localUri, complaintId) {
  try {
    console.log("Starting video upload process...");

    // Test Firebase Storage connectivity first
    const isAccessible = await testFirebaseStorage();
    if (!isAccessible) {
      throw new Error("Firebase Storage is not accessible");
    }

    const response = await fetch(localUri);
    if (!response.ok) {
      throw new Error(`Failed to fetch video: ${response.status}`);
    }

    const blob = await response.blob();
    console.log("Video blob created, size:", blob.size);

    // Get file extension from URI
    const extension = localUri.split(".").pop() || "mp4";
    const storageRef = ref(
      storage,
      `complaints/${complaintId}_video.${extension}`
    );
    console.log("Video storage reference created, uploading...");

    const uploadResult = await uploadBytes(storageRef, blob, {
      contentType: `video/${extension}`,
    });
    console.log("Video upload completed, getting download URL...");

    const downloadURL = await getDownloadURL(uploadResult.ref);
    console.log("Video download URL obtained:", downloadURL);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading video:", error);

    // Check if it's a CORS error
    if (error.message.includes("CORS") || error.message.includes("preflight")) {
      throw new Error(
        "مشكلة في إعدادات Firebase Storage. يرجى التحقق من إعدادات CORS."
      );
    }

    throw new Error(`فشل في رفع الفيديو: ${error.message}`);
  }
}

export {
  compressImage,
  uploadImageAndGetUrl,
  uploadVideoAndGetUrl,
  testFirebaseStorage,
};
