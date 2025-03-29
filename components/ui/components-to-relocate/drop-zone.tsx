import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { useDropzone, DropzoneOptions } from 'react-dropzone';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { FcCancel } from 'react-icons/fc';
import { IoMdClose } from 'react-icons/io';
import FormInput from '../general/form-components/form-input';

interface DropzoneProps {
  onDrop: (acceptedFiles: File[]) => void; // Accept File objects directly
  accept?: DropzoneOptions['accept'];
  showImages?: boolean;
  formInput?: {
    name: string;
    register: UseFormRegister<any>;
  };
}

const Dropzone: React.FC<DropzoneProps> = ({
  onDrop,
  accept,
  showImages = false,
  formInput,
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    multiple: true,
    onDrop: (files) => {
      setUploadedFiles((prevFiles) => [...prevFiles, ...files]);
      onDrop(files); // Pass File objects directly to the parent
    },
  });

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    onDrop(newFiles); // Update the parent component with the new list
  };

  return (
    <div>
      <div
        {...getRootProps()}
        style={{
          border: '2px dashed #A9A9A9',
          borderRadius: '4px',
          padding: '20px',
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: isDragActive ? '#f0f8ff' : '#fff',
        }}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag and drop or click to select files</p>
        )}
      </div>

      {uploadedFiles.length > 0 && (
        <div style={{ marginTop: '10px' }}>
          {!showImages ? (
            <ul>
              {uploadedFiles.map((file, index) => (
                <li
                  key={index}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                >
                  <span>{file.name}</span>
                  <button
                    onClick={() => removeFile(index)}
                    style={{ color: 'red', cursor: 'pointer' }}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className='flex flex-wrap justify-center'>
              {uploadedFiles.map((file, index) => {
                const fileUrl = URL.createObjectURL(file);
                return (
                  <div key={index} className='mt-2 w-full relative space-y-1'>
                    <div className='w-full'>
                      <img
                        src={fileUrl}
                        alt={file.name}
                        className='object-contain w-full h-32 border-[1px]' // Adjust height as needed
                        style={{ maxWidth: '100%', height: 'auto' }} // Contain the image within the div
                      />
                      <Button
                        onClick={() => removeFile(index)}
                        style={{
                          color: 'red',
                          cursor: 'pointer',
                          display: 'block',
                          marginTop: '5px',
                        }}
                        className='absolute right-[-10px] top-[-10px] bg-white-200 w-auto h-auto border-none p-0'
                        variant={'outline'}
                      >
                        <IoMdClose className='text-3xl text-black' />
                      </Button>
                    </div>
                    {formInput && (
                      <FormInput
                        name={`${formInput?.name}.${index}`}
                        label={''}
                        inputType='default'
                        placeholder='Enter Project Title' //temp solution
                        register={formInput?.register}
                        required={false}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dropzone;
