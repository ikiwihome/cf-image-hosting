export function Home() {
  return (
    <html lang="zh-CN">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <title>图床</title>
        <link rel="stylesheet" href="/static/bootstrap.min.css" />
        <link rel="stylesheet" href="/static/style.css" />
        <link href="/favicon.ico" rel="icon" />
      </head>

      <body>
        <div className="full-window" ondragover="event.preventDefault()">
          <div className="container card">
            <h3 className="text-center">图床</h3>
            <p className="text-center text-muted">
              免费且无限容量的图像托管平台
            </p>
            <button
              id="upload"
              className="btn btn-primary mx-auto"
              type="button"
              title="支持的文件格式：图片、视频、GIF"
            >
              <span className="spinner-grow spinner-grow-sm d-none"></span>
              <span className="upload-text">
                拖放文件或{" "}
                <u>
                  <i>浏览</i>
                </u>
              </span>
              <input
                id="fileInput"
                type="file"
                name="file"
                accept="image/*, video/*"
              />
            </button>
            <div
              id="uploadStatus"
              className="text-center"
              style="margin-top: 10px"
            ></div>
          </div>
        </div>

        <script src="/static/bootstrap.min.js"></script>
        <script src="/static/script.js"></script>
      </body>
    </html>
  );
}
