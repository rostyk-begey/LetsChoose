import React, {
  useState,
  useCallback,
  useEffect,
  PropsWithChildren,
} from 'react';
import { useDropzone } from 'react-dropzone';
import { useFormContext } from 'react-hook-form';

interface Props {
  name: string;
  accept: string;
  previewDefaultUrl?: string;
  previewHolderClassName: string;
  previewClassName: string;
}

const DropzoneFileInput: React.FC<PropsWithChildren<Props>> = ({
  name,
  accept,
  children,
  previewDefaultUrl = '',
  previewHolderClassName,
  previewClassName,
}) => {
  const { register, unregister, setValue, trigger, watch } = useFormContext();
  const file = watch(name);
  const [previewUrl, setPreviewUrl] = useState(previewDefaultUrl);
  const onDrop = useCallback(
    (droppedFiles) => {
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
    if (file && typeof file !== 'string') {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(previewDefaultUrl);
    }
  }, [file, previewDefaultUrl]);

  return (
    <div
      /* eslint-disable-next-line react/jsx-props-no-spreading */
      {...getRootProps({
        className: `d-flex align-items-center justify-content-center ${previewHolderClassName}`,
      })}
    >
      {previewUrl ? (
        <img className={previewClassName} src={previewUrl} alt="" />
      ) : (
        children
      )}
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <input {...getInputProps({ className: 'd-none' })} />
    </div>
  );
};

export default DropzoneFileInput;
