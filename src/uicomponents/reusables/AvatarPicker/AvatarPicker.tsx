import React, { useCallback, useState } from 'react';
import { useDropzone, DropzoneRootProps, DropzoneInputProps } from 'react-dropzone';
import styled from 'styled-components';
import { IStyledFC } from '../../IStyledFC';
import FadeLoader from "react-spinners/FadeLoader";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../Buttons/Button';
import UseRipple from '../Ripple/UseRipple';
import ReactCrop, { type Crop, makeAspectCrop, centerCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

import uploadAvatar from '../../../API/uploadAvatar';
import deleteTmpUpload from '../../../API/delete-tmp-upload';

interface FileObject extends File {
  preview: string;
}

const FCLoadingIndicator: React.FC<IStyledFC> = ({className}) => {

  return (
  <div className={className}>
    <FadeLoader color="#36d7b7" />
  </div>
  )
};

const LoadingIndicator = styled(FCLoadingIndicator)`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  width: 300px;
  height: 300px;
  align-items: center;
  border-radius: 5px;
  justify-content: center;
  background-color: #040712c2;
  font-size: 1.2em;
`;

interface IUploadProgressBar extends IStyledFC {
  progress: number;
}

const FCUploadProgressBar: React.FC<IUploadProgressBar> = ({className}) => {

  return (
    <div className={className}>
      <span className="progress-bar">
        <span className="progress"></span>
      </span>
    </div>
  )
};

const UploadProgressBar = styled(FCUploadProgressBar)`
  /* position: absolute;
  bottom: 10px;
  display: flex;
  width: 96%;
  padding: 10px 2%; */

  /* .progress-bar {
    display: flex;
    flex: 0 1 100%;
    align-items: center;
    border-radius: 5px;
    height: 5px;
  }

  .progress-bar .progress {
    height: 100%;
    width: ${(prop) => prop.progress}%;
    border-radius: inherit;
    background-color: ${({theme}) => theme.staticColor.primary};
  } */
  left: 0;

  &, .progress-bar {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: transparent;
  }

  .progress-bar {
    right: 0;
    width: calc(100% - ${(prop) => prop.progress}%);
    height: 100%;
    transition: width 300ms;
    background-color: #040712c2;
  }
`;

interface IReplaceCurrentImageConfirm extends IStyledFC {
  yes: () => Promise<{success: boolean}>;
  no: () => void;
};

const FCReplaceCurrentImageConfirm: React.FC<IReplaceCurrentImageConfirm> = ({className, no, yes}) => {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div className={className} onClick={(e) => e.stopPropagation()}> 
      <p className="question-text">
        Do you want to replace current image?
      </p>
      <span className="btn-container">
        <Button disabled={isLoading} variant='bordered-btn' label='No' onClick={() => no()}/>
        <Button isLoading={isLoading} variant='bordered-btn' label='Yes' onClick={() => {
          setIsLoading(true);
          yes()
          .then(res => {
            setIsLoading(false);
          })
          .catch(err => setIsLoading(false))
        }}/>
      </span>
    </div>
  )
}

const ReplaceCurrentImageConfirm = styled(FCReplaceCurrentImageConfirm)`
  display: flex;
  width: 200px;
  height: 150px;
  background-color: #040712c2;
  border-radius: 7px;
  z-index: 100;
  flex-wrap: wrap;
  
  .question-text {
    color: white;
    text-align: center;
    padding: 2px 5px;
  }

  .btn-container {
    display: flex;
    gap: 10px;
    flex: 0 1 100%;
    justify-content: center;
  }

  .btn-container ${Button} {
    font-size: 12px;
    color: white;
    border-color: white;
  }
  
  .btn-container ${Button} ${UseRipple} {
    padding: 7px 15px;
  }
`;

const FCErrorUploadMessage: React.FC<IStyledFC> = ({className}) => {
  return (
    <div className={className}>
      <div className="warning-message">
        <span className='icon-container'>
          <FontAwesomeIcon icon={["fas", "exclamation-circle"]} />
        </span>
        <p className='error-text'>Image upload faild!</p>
        {/* <span className="retry-btn">Retry</span> */}
      </div>
    </div>
  )
}

const ErrorUploadMessage = styled(FCErrorUploadMessage)<{active: boolean}>`
  position: absolute;
  top: ${(props) => props.active? 0 : "-45px"};
  left: 0;
  display: flex;
  width: 300px;
  height: 300px;
  background-color: transparent;
  font-size: 1.2em;
  transition: top 400ms;

  .warning-message {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    width: 300px;
    height: fit-content;
    align-items: center;
    color: white;
    background-color: #ff0000cc;
  }

  .warning-message .icon-container {
    display: flex;
    width: fit-content;
    height: fit-content;
    margin-left: 5px;
    margin-right: 10px;
    font-size: 13px;
  }

  .warning-message .error-text {
    font-size: 11px;
    padding: 5px 0;
    text-align: left;
    color: white;
  }

  .warning-message .retry-btn {
    width: fit-content;
    height: fit-content;
    margin: 0 10px;
    color: white;
    font-size: 12px;
    cursor: pointer;
    opacity: 0.8;
    :hover {
      transition: opacity 300ms;
      opacity: 1;
    }
  }
`;

const DropzoneContainer = styled.div<{active: boolean}>`
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  flex: 0 0 300px;
  height: 300px;
  justify-content: center;
  align-items: center;
  background-color: ${({theme}) => theme.mode == "dark"? "#050c10" : "#e9e9e9"};
  border-radius: 5px;
  border: 2px dashed ${({theme, active}) => active? theme.staticColor.primary : 'transparent'};
  transition: border-color 300ms;

  .icon {
    display: flex;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    align-items: center;
    justify-content: center;
    background-color: ${({theme}) => theme.mode == "dark"? "#15252d" : "#bbbbbb"};
    font-size: 22px;
    color: ${({theme, active}) => active? theme.staticColor.primary : theme.textColor.strong};
    transition: color 300ms;
  }

  .info-text {
    width: 100%;
    text-align: center;
    padding: 10px 15px;
    color: ${({theme}) => theme.textColor.strong};
    font-weight: 600;
    line-height: 1.1em;

    strong {
        font-size: 25px;
    }

    p {
        font-size: 12px;
    }
  }

`;

const PreviewAvatar = styled.div<{file: FileObject}>`
  position: absolute;
  /* top: 2px;
  left: 2px; */
  display: flex;
  align-items: center;
  justify-content: center;
  width: 300px;
  height: 300px;
  background-image: url(${props => props.file.preview});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  font-size: 1.2em;
  border-radius: 5px;
  transition: background-image 400ms;
  overflow: hidden;


  .middle-backdrop {
    position: absolute;
    display: flex;
    left: 0;
    top: 0;
    width: 300px;
    height: 300px;
    background-color: #fdfeffb5;
    font-size: 1.2em;
    border-radius: 5px;
  }

  .circle-image {
    position: absolute;
    /* top: 2px;
    left: 2px; */
    border-radius: 50%;
    display: flex;
    width: 300px;
    height: 300px;
    background-image: url(${props => props.file.preview});
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    font-size: 1.2em;
    transition: background-image 400ms;
  }
`;


function useAvatarUploaderContext() {
  const [disabled, setDisabled] = useState(false);
  const [imageTmpUploaded, setImageTmpUploaded] = useState<null | string>(null);
  const [isDeletingTmpImage, setIsDeletingTmpImage] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageReplace, setImageReplace] = useState<FileObject | null>(null);
  const [selectedImage, setSelectedImage] = useState<FileObject | null>(null);
  const [errorUpload, setErrorUpload] = React.useState(false);
  const [fileForCropping, setFileForCropping] = React.useState<null | FileObject>(null);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      // Handle dropped files here
      const image = acceptedFiles[0];
      const imagePreview: FileObject = Object.assign(image, {
        preview: URL.createObjectURL(image),
      });

      if(isUploading || isDeletingTmpImage || disabled) {
        return;
      }

      setFileForCropping(imagePreview);

      // if(!selectedImage) {
      //   setSelectedImage(imagePreview);
      // } else {
      //   setImageReplace(imagePreview)
      // }
    },
    multiple: false, // Allow only one file to be selected at a time
    accept:  {
        'image/*': [],
      } // Accept only image files
  });

  React.useEffect(() => {
    if(errorUpload) setErrorUpload(false);
    if(selectedImage) {
      const formData = new FormData();
      formData.append('picture', selectedImage);
      setIsUploading(true);
      uploadAvatar(formData, (progress) => setUploadProgress(progress))
      .then(response => {
        if(!response.success) {
          throw response;
        } else {
          setImageTmpUploaded(response.data?.filename as string);
        }
        setIsUploading(false);
      })
      .catch(err => {
        if(imageTmpUploaded) setImageTmpUploaded(null);
        setErrorUpload(true);
        setIsUploading(false);
      })
    }
  }, [selectedImage]);

  return [
    disabled, setDisabled,
    imageTmpUploaded, setImageTmpUploaded,
    isDeletingTmpImage, setIsDeletingTmpImage,
    isUploading, setIsUploading,
    uploadProgress, setUploadProgress,
    imageReplace, setImageReplace,
    selectedImage, setSelectedImage,
    errorUpload, setErrorUpload,
    fileForCropping, setFileForCropping,
    getRootProps, getInputProps, isDragActive,
    function reset() {
      if(imageTmpUploaded) {
        setIsDeletingTmpImage(true);
        deleteTmpUpload(imageTmpUploaded)
        .then(response => {
          if(response.success) {
            setImageTmpUploaded(null);
            setSelectedImage(null);
            setImageReplace(null);
            setIsDeletingTmpImage(false);
          } else {
            throw response
          }
        }).catch(err => {
          setIsDeletingTmpImage(false);
          setImageTmpUploaded(null);
          setImageReplace(null);
          setSelectedImage(null);
        })
      }
      else {
        setImageTmpUploaded(null);
        setSelectedImage(null);
        setImageReplace(null);
      }
    }
  ] as [
    boolean, React.Dispatch<React.SetStateAction<boolean>>,
    string | null, React.Dispatch<React.SetStateAction<string | null>>,
    boolean, React.Dispatch<React.SetStateAction<boolean>>,
    boolean, React.Dispatch<React.SetStateAction<boolean>>,
    number, React.Dispatch<React.SetStateAction<number>>,
    FileObject | null, React.Dispatch<React.SetStateAction<FileObject | null>>,
    FileObject | null, React.Dispatch<React.SetStateAction<FileObject | null>>,
    boolean, React.Dispatch<React.SetStateAction<boolean>>,
    FileObject | null, React.Dispatch<React.SetStateAction<FileObject | null>>,
    <T extends DropzoneRootProps>(props?: T | undefined) => T, 
    <T extends DropzoneInputProps>(props?: T | undefined) => T, boolean,
    () => void,
  ];
}

interface IAvatarPickerComponent extends IStyledFC {
  onChange?: (avatarName: string | null) => void,
  onUpload?: () => void,
  onErrorUpload?: () => void,
  disabledPicker?: boolean,
  doReset?: boolean
}

const FCAvatarPickerComponent: React.FC<IAvatarPickerComponent> = ({className, onChange, onErrorUpload, onUpload, disabledPicker, doReset}) => {
  const [
    disabled, setDisabled,
    imageTmpUploaded, setImageTmpUploaded,
    isDeletingTmpImage, setIsDeletingTmpImage,
    isUploading, setIsUploading,
    uploadProgress, setUploadProgress,
    imageReplace, setImageReplace,
    selectedImage, setSelectedImage,
    errorUpload, setErrorUpload,
    fileForCropping, setFileForCropping,
    getRootProps, getInputProps, isDragActive,
    reset,
  ] = useAvatarUploaderContext();

  const [crop, setCrop] = useState<Crop>();
  const imageForCropElem = React.useRef<null | HTMLImageElement>(null);
  const [cropedImage, setCropedImage] = React.useState<null | string>(null);

  const getCroppedImg = (image: HTMLImageElement, crop: Crop, fileName: string) => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = image.width;
    canvas.height = image.height;

    console.log(image.naturalWidth)
    console.log(image.naturalHeight);
    console.log(image.width)
    console.log(image.height)
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("No 2d context");
    }

    ctx.drawImage(
      image,
      0,
      0,
      image.width,
      image.height,
      0,
      0,
      image.width,
      image.height,
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            console.error('Canvas is empty');
            return;
          }
  
          // Create a File object with the desired name
          const file = new File([blob], fileName, { type: 'image/jpeg' });
          
          // Resolve with the object URL of the File
          resolve(window.URL.createObjectURL(file));
        },
        'image/jpeg'
      );
    });
  };

  React.useEffect(() => {
    onChange && onChange(imageTmpUploaded);
  }, [imageTmpUploaded]);

  React.useEffect(() => {
    isUploading && onUpload && onUpload();
  }, [isUploading]);

  React.useEffect(() => {
    errorUpload && onErrorUpload && onErrorUpload();
  }, [errorUpload]);

  React.useEffect(() => {
    setDisabled(disabledPicker as boolean);
  }, [disabledPicker]);

  React.useEffect(() => {
    !(isDeletingTmpImage) && doReset && reset()
  }, [doReset]);

  React.useEffect(() => {
    if (fileForCropping) {
      // Create a FileReader
      const reader = new FileReader();

      reader.onload = function (e) {
        const dataURL = e.target?.result;

        // Set the data URL as the src attribute of the image element
        imageForCropElem.current?.setAttribute('src', dataURL as string);

        if(imageForCropElem.current) {
          imageForCropElem.current.onload = (e: any) => {
            const { naturalWidth: width, naturalHeight: height } = e.currentTarget;
            const crop = centerCrop(
              makeAspectCrop(
                {
                  unit: '%',
                  width: 90,
                },
                1,
                width,
                height
              ),
              width,
              height
            )
            setCrop(crop)
          }
        }
      }
      // Read the content of the file as a data URL
      reader.readAsDataURL(fileForCropping);
    }
  }, [fileForCropping])
  return (
    <div className={className}>
      {
        fileForCropping? 
        <div className="cropping-tool-container">
          <ReactCrop 
          crop={crop} 
          circularCrop 
          keepSelection
          onChange={(c, p) => setCrop(p)} 
          aspect={1} 
          className='image-crop'
          onComplete={async  (c, p) => {
            if (imageForCropElem.current && crop && crop.width && crop.height) {
              const croppedImageUrl = await getCroppedImg(
                imageForCropElem.current,
                crop,
                'newFile.jpeg'
              );
              // You can save the cropped image URL or upload it to a server.
              setCropedImage(croppedImageUrl as string);
            }
          }}>
            <img ref={imageForCropElem} />
          </ReactCrop><br />
            {cropedImage? <img src={cropedImage} /> : ''}
            <Button label='Crop' variant='hidden-bg-btn' icon={<FontAwesomeIcon icon={['fas', 'crop-alt']}/>} />
        </div> : 
        <>
        <DropzoneContainer {...getRootProps({active: isDragActive})}>
          <input disabled={disabled} {...getInputProps()} />
          {
            selectedImage? <PreviewAvatar file={selectedImage}>
              <div className="middle-backdrop"></div>
              <div className="circle-image"></div>
              <ErrorUploadMessage active={errorUpload} />
              {/* {  isDeletingTmpImage && <LoadingIndicator /> }  */}
              { imageReplace && <ReplaceCurrentImageConfirm 
              yes={() => {
                return new Promise<{success: boolean}>((res, rej) => {
                  if(imageTmpUploaded) {
                    setIsDeletingTmpImage(true);
                    deleteTmpUpload(imageTmpUploaded)
                    .then(response => {
                      if(response.success) {
                        setSelectedImage(imageReplace);
                        setImageReplace(null);
                        setIsDeletingTmpImage(false);
                        res({success: true})
                      } else {
                        throw response
                      }
                    }).catch(err => {
                      setIsDeletingTmpImage(false);
                      setImageReplace(null);
                      setSelectedImage(null);
                      rej({success: false})
                    })
                  } else {
                    setSelectedImage(imageReplace);
                    setImageReplace(null);
                    res({success: true})
                  }
                })
              }} 
              no={() => setImageReplace(null)} />}
              { isUploading && <LoadingIndicator /> } 
            </PreviewAvatar> :
            <>
              <span className="icon">
                <FontAwesomeIcon icon={["fas", "image"]} />
              </span>
              <span className='info-text'>
                  <strong>Add photo</strong>
                  <p>or drag and drop</p>
              </span>
            </>
          }
        </DropzoneContainer>
        {
          selectedImage && !isUploading && <span className='remove-selected-image-btn-container'>
            <Button disabled={disabled} isLoading={isDeletingTmpImage} variant='hidden-bg-btn' label='Remove picture' icon={<FontAwesomeIcon icon={["fas", "times"]}  />} 
            onClick={() => {
              reset()
            }}/>
          </span>
        }
        </>
      }
      
    </div>
  )
}

const AvatarPicker = styled(FCAvatarPickerComponent)`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  border-radius: 5px;
  border: 2px solid ${({theme}) => theme.borderColor};
  width: 300px;
  height: fit-content;
  padding: 8px;

  && > .cropping-tool-container {
    display: flex;
    flex-wrap: wrap;
    flex: 0 0 300px;
    align-items: center;
    justify-content: center;
    min-height: 300px;

    > ${Button} {
      margin-top: 5px;
    }
  }

  && > .remove-selected-image-btn-container {
    display: flex;
    flex: 0 1 100%;
    justify-content: center;
    margin-top: 10px;
  }
`

export default AvatarPicker;
