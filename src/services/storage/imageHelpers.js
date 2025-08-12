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
    // resize and compress to keep under a few hundred KB
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 1280 } }],
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
    );
    return result.uri;
  } catch (error) {
    console.error("Error compressing image:", error);
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

    // Test Firebase Storage connectivity first
    const isAccessible = await testFirebaseStorage();
    if (!isAccessible) {
      throw new Error("Firebase Storage is not accessible");
    }

    const compressedUri = await compressImage(localUri);
    console.log("Image compressed, fetching blob...");

    const response = await fetch(compressedUri);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }

    const blob = await response.blob();
    console.log("Blob created, size:", blob.size);

    const storageRef = ref(storage, `complaints/${complaintId}.jpg`);
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

    // Check if it's a CORS error
    if (error.message.includes("CORS") || error.message.includes("preflight")) {
      console.log("CORS error detected, trying alternative method...");
      try {
        // Try alternative upload method
        const storageRef = ref(storage, `complaints/${complaintId}.jpg`);
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
