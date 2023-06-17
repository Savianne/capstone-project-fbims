import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';
import { IStyledFC } from '../../IStyledFC';
import FadeLoader from "react-spinners/FadeLoader";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../Buttons/Button';
import UseRipple from '../Ripple/UseRipple';

import uploadAvatar from '../../../API/uploadAvatar';
import deleteTmpUpload from '../../../API/delete-tmp-upload';
import { setTimeout } from 'timers';

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
  width: 296px;
  height: 296px;
  align-items: center;
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
    font-sizea: 12px;
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
  width: 296px;
  height: 296px;
  background-color: transparent;
  font-size: 1.2em;
  transition: top 400ms;

  .warning-message {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    width: 296px;
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
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  flex: 0 0 300px;
  height: 300px;
  justify-content: center;
  align-items: center;
  border-style: dashed;
  border-width: 4px;
  border-color: ${({theme, active}) => active? theme.staticColor.primary : theme.borderColor};
  transition: border-color 300ms;

  .icon {
    font-size: 55px;
    color: ${({theme, active}) => active? theme.staticColor.primary : theme.borderColor};
    transition: color 300ms;
  }

  p {
    width: 100%;
    text-align: center;
    padding: 10px 15px;
    color: ${({theme}) => theme.textColor.light};
  }

`;

const PreviewAvatar = styled.div<{file: FileObject}>`
  position: absolute;
  top: 2px;
  left: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 296px;
  height: 296px;
  background-image: url(${props => props.file.preview});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  font-size: 1.2em;
  transition: background-image 400ms;
  overflow: hidden;


  .middle-backdrop {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    width: 296px;
    height: 296px;
    background-color: #fdfeffb5;
    font-size: 1.2em;
  }

  .circle-image {
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 50%;
    display: flex;
    width: 296px;
    height: 296px;
    background-image: url(${props => props.file.preview});
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    font-size: 1.2em;
    transition: background-image 400ms;
  }
`;

interface IAvatarUploader extends IStyledFC {
  onTempUploaded: (tempFileName: string | null) => void,
  onProcessStart: () => void,
  onProcessFinished: () => void,
}

const FCAvatarUploader: React.FC<IAvatarUploader> = ({className, onTempUploaded, onProcessFinished, onProcessStart}) => {
  const [imageTmpUploaded, setImageTmpUploaded] = useState<null | string>(null);
  const [isDeletingTmpImage, setIsDeletingTmpImage] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageReplace, setImageReplace] = useState<FileObject | null>(null);
  const [selectedImage, setSelectedImage] = useState<FileObject | null>(null);
  const [errorUpload, setErrorUpload] = React.useState(false);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      // Handle dropped files here
      const image = acceptedFiles[0];
      const imagePreview: FileObject = Object.assign(image, {
        preview: URL.createObjectURL(image),
      });

      if(isUploading || isDeletingTmpImage) {
        return;
      }

      if(!selectedImage) {
        setSelectedImage(imagePreview);
      } else {
        setImageReplace(imagePreview)
      }
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

  React.useEffect(() => {
    onTempUploaded(imageTmpUploaded);
  }, [imageTmpUploaded]);

  React.useEffect(() => {
    if(isDeletingTmpImage || isUploading) {
      onProcessStart();
    } else {
      onProcessFinished();
    }
  }, [isDeletingTmpImage, isUploading]);

  return (
    <div className={className}>
        <DropzoneContainer {...getRootProps({active: isDragActive})}>
          <input {...getInputProps()} />
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
                <FontAwesomeIcon icon={["fas", "cloud-upload-alt"]} />
              </span>
              <p>Drag & Drop your image file here, or click to select image</p>
            </>
          }
        </DropzoneContainer>
        {
          selectedImage && !isUploading && <span className='remove-selected-image-btn-container'>
            <Button isLoading={isDeletingTmpImage} variant='hidden-bg-btn' label='Remove avatar' icon={<FontAwesomeIcon icon={["fas", "times"]}  />} 
            onClick={() => {
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
            }}/>
          </span>
        }
    </div>
  );
};

const AvatarUploader = styled(FCAvatarUploader)`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;

  .remove-selected-image-btn-container {
    display: flex;
    flex: 0 1 100%;
    justify-content: center;
    margin-top: 10px;
  }
`
export function useAvatarUploaderContext() {
  const [diabled, setDisabled] = useState(false);
  const [imageTmpUploaded, setImageTmpUploaded] = useState<null | string>(null);
  const [isDeletingTmpImage, setIsDeletingTmpImage] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageReplace, setImageReplace] = useState<FileObject | null>(null);
  const [selectedImage, setSelectedImage] = useState<FileObject | null>(null);
  const [errorUpload, setErrorUpload] = React.useState(false);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      // Handle dropped files here
      const image = acceptedFiles[0];
      const imagePreview: FileObject = Object.assign(image, {
        preview: URL.createObjectURL(image),
      });

      if(isUploading || isDeletingTmpImage) {
        return;
      }

      if(!selectedImage) {
        setSelectedImage(imagePreview);
      } else {
        setImageReplace(imagePreview)
      }
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
    imageTmpUploaded, setImageTmpUploaded,
    isDeletingTmpImage, setIsDeletingTmpImage,
    isUploading, setIsUploading,
    uploadProgress, setUploadProgress,
    imageReplace, setImageReplace,
    selectedImage, setSelectedImage,
    errorUpload, setErrorUpload,
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
  ];
}

interface IAvatarUploaderComponent extends IStyledFC {
  context: any
}

const FCAvatarUploaderComponent: React.FC<IAvatarUploaderComponent> = ({className, context}) => {
  const [
    imageTmpUploaded, setImageTmpUploaded,
    isDeletingTmpImage, setIsDeletingTmpImage,
    isUploading, setIsUploading,
    uploadProgress, setUploadProgress,
    imageReplace, setImageReplace,
    selectedImage, setSelectedImage,
    errorUpload, setErrorUpload,
    getRootProps, getInputProps, isDragActive,
    reset,
  ] = context;
  return (
    <div className={className}>
      <DropzoneContainer {...getRootProps({active: isDragActive})}>
        <input {...getInputProps()} />
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
              <FontAwesomeIcon icon={["fas", "cloud-upload-alt"]} />
            </span>
            <p>Drag & Drop your image file here, or click to select image</p>
          </>
        }
      </DropzoneContainer>
      {
        selectedImage && !isUploading && <span className='remove-selected-image-btn-container'>
          <Button isLoading={isDeletingTmpImage} variant='hidden-bg-btn' label='Remove avatar' icon={<FontAwesomeIcon icon={["fas", "times"]}  />} 
          onClick={() => {
            reset()
          }}/>
        </span>
      }
    </div>
  )
}

export const AvatarUploaderComponent = styled(FCAvatarUploaderComponent)`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;

  .remove-selected-image-btn-container {
    display: flex;
    flex: 0 1 100%;
    justify-content: center;
    margin-top: 10px;
  }
`

export default AvatarUploader;
