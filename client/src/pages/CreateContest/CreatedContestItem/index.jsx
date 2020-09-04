import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from 'tabler-react';
import cn from 'classnames';

import './index.scss';

const CreatedContestItem = ({ image, title, onUpdate, onDelete }) => {
  const baseClassName = 'created-contest-item';
  const fileInputName = 'image';
  const [imageUrl, setImageUrl] = useState(URL.createObjectURL(image));
  const { register, watch, reset, handleSubmit } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });
  const files = watch(fileInputName);
  const [showEditor, setShowEditor] = useState(false);
  const cancelEdit = () => {
    setShowEditor(false);
    setImageUrl(URL.createObjectURL(image));
    reset();
  };
  const onSubmit = ({ image: updatedImage, title: updatedTitle }) => {
    const data = {};
    if (updatedTitle) {
      data.title = updatedTitle;
    }
    if (updatedImage?.length) {
      data.image = updatedImage.item(0);
    }
    onUpdate(data);
  };
  useEffect(() => {
    if (files?.length) {
      setImageUrl(URL.createObjectURL(files.item(0)));
    }
  }, [files]);

  return (
    <div
      className={cn(baseClassName, 'p-3', {
        [`${baseClassName}--is-edited`]: showEditor,
      })}
    >
      <div className="d-flex align-items-center">
        <span
          className="avatar avatar-xxl mr-3 flex-shrink-0"
          style={{ backgroundImage: `url(${imageUrl})`, flexShrink: '0' }}
        >
          <input
            type="file"
            className="w-100 h-100"
            disabled={!showEditor}
            accept="image/jpeg"
            style={{ opacity: '0' }}
            name={fileInputName}
            ref={register()}
          />
        </span>
        {showEditor ? (
          <input
            className={cn('form-control mr-3', {
              'is-invalid': false,
            })}
            tabIndex={1}
            name="title"
            type="text"
            placeholder="Title"
            defaultValue={title}
            ref={register()}
          />
        ) : (
          <h5 className="h5 mr-auto mb-0">{title}</h5>
        )}
        <Button.List className="d-flex ml-3">
          {showEditor ? (
            <>
              <Button color="primary" outline onClick={cancelEdit}>
                Cancel
              </Button>
              <Button color="success" onClick={handleSubmit(onSubmit)}>
                Save
              </Button>
            </>
          ) : (
            <>
              <Button
                outline
                color="primary"
                icon="edit"
                onClick={() => setShowEditor(true)}
              />
              <Button color="danger" icon="trash" onClick={onDelete} />
            </>
          )}
        </Button.List>
      </div>
    </div>
  );
};

export default CreatedContestItem;
