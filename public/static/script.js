const fileInput = document.querySelector("#fileInput");
const uploadStatus = document.querySelector("#uploadStatus");
const fullWindow = document.querySelector(".full-window");

document.addEventListener("paste", onFilePaste);
fullWindow.addEventListener("drop", onFileDrop);
fileInput.addEventListener("change", onFileChange);

function onFileChange() {
  const file = fileInput.files[0];
  if (file) handleUpload(file);
}

function onFileDrop(event) {
  event.preventDefault();
  let files = event.dataTransfer.files;
  for (let i = 0; i < files.length; i++) {
    handleUpload(files[i]);
  }
}

function onFilePaste(event) {
  const items = (event.clipboardData || event.originalEvent.clipboardData)
    .items;
  for (let index in items) {
    const item = items[index];
    if (item.kind === "file") {
      const blob = item.getAsFile();
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Data = event.target.result.split(",")[1];
        const dataType = event.target.result.split(";")[0];
        const fileType = dataType.split(":")[1];
        const data = window.atob(base64Data);
        const ia = new Uint8Array(data.length);
        for (let i = 0; i < data.length; i++) {
          ia[i] = data.charCodeAt(i);
        }
        const blob = new Blob([ia.buffer], { type: fileType });
        const file = new File([blob], "screenshot.jpg", { type: fileType });
        handleUpload(file);
      };
      reader.readAsDataURL(blob);
    }
  }
}

function onFileUrlCopy() {
  const imageUrl = document.querySelector("#imageUrl");
  navigator.clipboard
    .writeText(imageUrl.value)
    .then(() => {
      document.querySelector(".copy-btn").textContent = "已复制";
      setTimeout(() => {
        document.querySelector(".copy-btn").textContent = "复制";
      }, 1000);
    })
    .catch((error) => {
      console.error("复制URL失败", error);
    });
}

function handleCompressFile(file) {
  const maxFileSize = 500 * 1024 * 1024; // 500MB
  return new Promise((resolve) => {
    if (file.size <= maxFileSize || !file.type.startsWith("image")) {
      resolve(file);
    } else {
      imageCompression(file, { maxSizeMB: 5 })
        .then((compressedFile) => {
          resolve(compressedFile);
        })
        .catch((error) => {
          console.error(">> 图片压缩出现错误", error);
          resolve(file);
        });
    }
  });
}

function handleUpload(file) {
  document.querySelector(".upload-text").textContent = "上传中...";
  document.querySelector(".spinner-grow").classList.remove("d-none");
  handleCompressFile(file).then((compressedFile) => {
    const formData = new FormData();
    formData.append("file", compressedFile);
    fetch("/upload", { method: "POST", body: formData })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.error) {
          throw new Error(data.error);
        }
        const src = window.location.origin + data[0].src;
        uploadStatus.innerHTML = `
        <div class="alert alert-success text-center">成功 🥳</div>
        <div class="input-group" style="margin-bottom: 10px">
          <input type="text" class="form-control" id="imageUrl" value="${src}">
          <div class="input-group-append">
            <button class="btn btn-outline-secondary copy-btn" type="button">复制</button>
          </div>
        </div>
        ${
          file.type.startsWith("video")
            ? `<video src="${src}" class="img-fluid mb-3" controls></video>`
          : `<img src="${src}" class="img-fluid mb-3" alt="上传图片">`
        }
        `;
        document
          .querySelector(".copy-btn")
          .addEventListener("click", onFileUrlCopy);
      })
      .catch((error) => {
        uploadStatus.innerHTML = `
        <div class="alert alert-danger">${
          error || "上传失败，请再次尝试"
        }</div>
        `;
      })
      .finally(() => {
        document.querySelector(".upload-text").textContent = "再次上传";
        document.querySelector(".spinner-grow").classList.add("d-none");
      });
  });
}
