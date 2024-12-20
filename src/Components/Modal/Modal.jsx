import React from 'react';
import { IoClose } from 'react-icons/io5';

const Modal = ({
  isOpen,
  onClose,
  onSubmit,
  nameEn,
  setNameEn,
  nameRu,
  setNameRu,
  setImg,
  buttonText,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <form onSubmit={onSubmit} className="form2">
        <button className="close-button" onClick={onClose} type="button">
          <IoClose />
        </button>
        <input
          type="text"
          placeholder="Name EN"
          value={nameEn}
          onChange={(e) => setNameEn(e.target.value)}
        />
        <input
          type="text"
          placeholder="Name RU"
          value={nameRu}
          onChange={(e) => setNameRu(e.target.value)}
        />
        <input
          className="file"
          type="file"
          accept="image/*"
          onChange={(e) => setImg(e?.target?.files[0])}
        />
        <button type="submit">{buttonText}</button>
      </form>
    </div>
  );
};

export default Modal;
