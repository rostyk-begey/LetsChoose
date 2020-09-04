import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useFormContext } from 'react-hook-form';

const DropzoneFileInput = ({
  name,
  accept,
  previewHolderClassName,
  previewClassName,
}) => {
  const { register, unregister, setValue, trigger, watch } = useFormContext();
  const file = watch(name);
  const [previewUrl, setPreviewUrl] = useState('');
  const onDrop = useCallback(
    (droppedFiles) => {
      console.log(droppedFiles[0]);
      setValue(name, droppedFiles[0], {
        shouldValidate: true,
        shouldDirty: true,
      });
      // trigger(name).then(() => {});
    },
    [setValue, trigger, name],
  );
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept,
    multiple: false,
  });
  useEffect(() => {
    register(name);
    return () => unregister(name);
  }, [register, unregister, name]);
  useEffect(() => {
    if (file) {
      // console.log(file.path);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      // console.log('no file');
      setPreviewUrl('');
    }
  }, [file]);
  // useEffect(() => {
  //   if (acceptedFiles?.length) {
  //     setValue(name, acceptedFiles[0], {
  //       shouldValidate: true,
  //       shouldDirty: true,
  //     });
  //     setPreviewUrl(URL.createObjectURL(acceptedFiles[0]));
  //   } else {
  //     setPreviewUrl('');
  //   }
  // }, [acceptedFiles]);

  return (
    <div
      {...getRootProps({
        className: `d-flex align-items-center justify-content-center ${previewHolderClassName}`,
      })}
    >
      {previewUrl ? (
        <img className={previewClassName} src={previewUrl} alt="" />
      ) : (
        <h3 className="px-2 m-0">
          Drag & drop image here, or click to select image
        </h3>
      )}
      <input
        // type="file"
        // className="d-none"
        // name={name}
        {...getInputProps({
          className: 'd-none',
        })}
      />
    </div>
  );
};

export default DropzoneFileInput;
