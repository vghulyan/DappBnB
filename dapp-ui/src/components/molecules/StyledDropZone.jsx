import React, { useMemo, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Box, Typography } from "@mui/material";

const thumbsContainer = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  marginTop: 16,
  justifyContent: "space-between",
};

const thumb = {
  display: "inline-flex",
  borderRadius: 2,
  border: "1px solid #eaeaea",
  marginBottom: 8,
  width: "48%", // Adjust width to fit two thumbnails per row
  height: 100,
  padding: 4,
  boxSizing: "border-box",
};

const thumbInner = {
  display: "flex",
  minWidth: 0,
  overflow: "hidden",
};

const img = {
  display: "block",
  width: "auto",
  height: "100%",
};

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  // backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
  height: "100%",
  overflow: "auto",
};

const focusedStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

const maxLength = 20;

function nameLengthValidator(file) {
  if (file.name.length > maxLength) {
    return {
      code: "name-too-large",
      message: `Name is larger than ${maxLength} characters`,
    };
  }
  return null;
}

function StyledDropZone({ onFilesAccepted, resetTrigger }) {
  const [images, setImages] = useState([]);
  const [fileRejections, setFileRejections] = useState([]);

  const {
    isFocused,
    getRootProps,
    isDragAccept,
    getInputProps,
    isDragReject,
    isDragActive,
  } = useDropzone({
    maxFiles: 10,
    validator: nameLengthValidator,
    accept: {
      "image/jpeg": [],
      "image/jpg": [],
      "image/png": [],
      "image/webp": [],
    },
    onDrop: (acceptedFiles) => {
      const _updatedImages = acceptedFiles?.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      setImages(_updatedImages);
      setFileRejections([]);
      onFilesAccepted(acceptedFiles);
    },
    onDropRejected: (fileRejections) => {
      setFileRejections(fileRejections);
    },
  });

  const thumbs = images.map((file) => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <img
          src={file.preview}
          alt={file?.name}
          style={img}
          onLoad={() => {
            URL.revokeObjectURL(file.preview);
          }}
        />
      </div>
    </div>
  ));

  useEffect(() => {
    return () => images.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [images]);

  useEffect(() => {
    if (resetTrigger) {
      setImages([]);
      setFileRejections([]);
    }
  }, [resetTrigger]);

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  const fileRejectionItems = fileRejections?.map(({ file, errors }) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
      <ul>
        {errors?.map((e) => (
          <li key={e.code}>{e.message}</li>
        ))}
      </ul>
    </li>
  ));

  return (
    <Box {...getRootProps({ style })}>
      <input {...getInputProps()} />
      <Typography>
        Drag 'n' drop some files here, or click to select files
      </Typography>
      {fileRejectionItems.length > 0 && (
        <aside>
          <h4>Rejected files</h4>
          <ul>{fileRejectionItems}</ul>
        </aside>
      )}
      <aside style={thumbsContainer}>{thumbs}</aside>
    </Box>
  );
}

export default StyledDropZone;

// import React, { useMemo, useState, useEffect } from "react";
// import { useDropzone } from "react-dropzone";
// import { Box, Typography } from "@mui/material";

// const thumbsContainer = {
//   display: "flex",
//   flexDirection: "row",
//   flexWrap: "wrap",
//   marginTop: 16,
// };

// const thumb = {
//   display: "inline-flex",
//   borderRadius: 2,
//   border: "1px solid #eaeaea",
//   marginBottom: 8,
//   marginRight: 8,
//   width: 100,
//   height: 100,
//   padding: 4,
//   boxSizing: "border-box",
// };

// const thumbInner = {
//   display: "flex",
//   minWidth: 0,
//   overflow: "hidden",
// };

// const img = {
//   display: "block",
//   width: "auto",
//   height: "100%",
// };

// const baseStyle = {
//   flex: 1,
//   display: "flex",
//   flexDirection: "column",
//   alignItems: "center",
//   padding: "20px",
//   borderWidth: 2,
//   borderRadius: 2,
//   borderColor: "#eeeeee",
//   borderStyle: "dashed",
//   //   backgroundColor: "#fafafa",
//   color: "#bdbdbd",
//   outline: "none",
//   transition: "border .24s ease-in-out",
// };

// const focusedStyle = {
//   borderColor: "#2196f3",
// };

// const acceptStyle = {
//   borderColor: "#00e676",
// };

// const rejectStyle = {
//   borderColor: "#ff1744",
// };

// const maxLength = 20;

// function nameLengthValidator(file) {
//   if (file.name.length > maxLength) {
//     return {
//       code: "name-too-large",
//       message: `Name is larger than ${maxLength} characters`,
//     };
//   }

//   return null;
// }

// function StyledDropZone({ onFilesAccepted, resetTrigger }) {
//   const [images, setImages] = useState([]);
//   const [fileRejections, setFileRejections] = useState([]);

//   const {
//     isFocused,
//     getRootProps,
//     isDragAccept,
//     getInputProps,
//     isDragReject,
//     isDragActive,
//   } = useDropzone({
//     maxFiles: 10,
//     validator: nameLengthValidator,
//     accept: {
//       "image/jpeg": [],
//       "image/jpg": [],
//       "image/png": [],
//       "image/webp": [],
//     },
//     onDrop: (acceptedFiles) => {
//       const _updatedImages = acceptedFiles?.map((file) =>
//         Object.assign(file, {
//           preview: URL.createObjectURL(file),
//         })
//       );
//       setImages(_updatedImages);
//       setFileRejections([]);
//       onFilesAccepted(acceptedFiles);
//     },
//     onDropRejected: (fileRejections) => {
//       setFileRejections(fileRejections);
//     },
//   });

//   const thumbs = images.map((file) => (
//     <div style={thumb} key={file.name}>
//       <div style={thumbInner}>
//         <img
//           src={file.preview}
//           alt={file?.name}
//           style={img}
//           onLoad={() => {
//             URL.revokeObjectURL(file.preview);
//           }}
//         />
//       </div>
//     </div>
//   ));

//   useEffect(() => {
//     // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
//     return () => images.forEach((file) => URL.revokeObjectURL(file.preview));
//   }, [images]);

//   useEffect(() => {
//     if (resetTrigger) {
//       // Reset images in dropzone when resetTrigger changes
//       setImages([]);
//       setFileRejections([]);
//     }
//   }, [resetTrigger]);

//   const style = useMemo(
//     () => ({
//       ...baseStyle,
//       ...(isFocused ? focusedStyle : {}),
//       ...(isDragAccept ? acceptStyle : {}),
//       ...(isDragReject ? rejectStyle : {}),
//     }),
//     [isFocused, isDragAccept, isDragReject]
//   );

//   const fileRejectionItems = fileRejections?.map(({ file, errors }) => (
//     <li key={file.path}>
//       {file.path} - {file.size} bytes
//       <ul>
//         {errors?.map((e) => (
//           <li key={e.code}>{e.message}</li>
//         ))}
//       </ul>
//     </li>
//   ));

//   return (
//     <Box>
//       <Box {...getRootProps({ style })}>
//         <input {...getInputProps()} />
//         {isDragAccept && <p>All files will be accepted</p>}
//         {isDragReject && <p>Some files will be rejected</p>}
//         {!isDragActive && <p>Drop some files here ...</p>}
//         <Typography>
//           Drag 'n' drop some files here, or click to select files
//         </Typography>
//       </Box>
//       <aside>
//         {fileRejectionItems && fileRejectionItems?.length > 0 && (
//           <>
//             <h4>Rejected files</h4>
//             <ul>{fileRejectionItems}</ul>
//           </>
//         )}
//       </aside>
//       <aside style={thumbsContainer}>{thumbs}</aside>
//     </Box>
//   );
// }

// export default StyledDropZone;
