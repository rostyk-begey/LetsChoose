import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useFormContext } from 'react-hook-form';

const DropzoneFileInput = ({
  name,
  accept,
  children,
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

  return (
    <div
      {...getRootProps({
        className: `d-flex align-items-center justify-content-center ${previewHolderClassName}`,
      })}
    >
      {previewUrl ? (
        <img className={previewClassName} src={previewUrl} alt="" />
      ) : (
        children
      )}
      <input {...getInputProps({ className: 'd-none' })} />
    </div>
  );
};

export default DropzoneFileInput;
