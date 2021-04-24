import React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import ZropZone from "react-dropzone";
import { showMessages } from "../../actions/messages";
import { connect } from "react-redux";
const FileUploader = ({ onUploadFile }: { onUploadFile: Function }) => {
  const onPhotoSelected = async (files: any) => {
    for (let file of files) {
      if (file.size >= 1024000) {
        showMessages("File need to be smaller than 1Mb.", "danger");
        return;
      }
      const fileName = file.name;

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const cfg = {
          headers: { "Content-Type": "application/json" },
        };
        try {
          showMessages("Uploading...");
          const res = await axios.post(
            "/api/upload",
            JSON.stringify({ data: reader.result }),
            cfg
          );
          if (res.status !== 200) {
            showMessages("Upload failed.", "danger");
            if (res.status === 503) {
              showMessages("File too large.", "danger");
            }
          } else {
            showMessages("Uploaded.");
            onPhotoUploaded(fileName, res.data);
          }
        } catch (error) {
          console.log("Upload failed.", error);
          showMessages("Upload failed.", "danger");
          return;
        }
      };
    }
  };
  const onPhotoUploaded = (name: string, res: any) => {
    onUploadFile(name, res["secure_url"]);
  };
  return (
    <div className="k-dropfile" id="upload">
      <span>Drop Photo in here.</span>
      <ZropZone
        // disableClick={true}
        multiple={false}
        accept="image/*"
        onDrop={(files) => onPhotoSelected(files)}
      >
        {({ getRootProps, getInputProps }) => (
          <section>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
            </div>
          </section>
        )}
      </ZropZone>
    </div>
  );
};
export default FileUploader;
