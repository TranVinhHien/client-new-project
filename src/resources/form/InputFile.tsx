'use client';

import { Button } from 'primereact/button';
import { ChangeEvent, memo, useRef, useState } from 'react';
import { InputFileProps } from '@/assets/types/form';



const InputFile = memo(
    ({
        multiple,
        accept = '*',
        label,
        placeholder = 'Danh sách file',
        disabled,
        onChange = () => { },
        onRemove = () => { },
        onSubmitFile = () => { }
    }: InputFileProps) => {
        const inputRef = useRef<HTMLInputElement>(null);
        const [filesName, setFiles] = useState<string[]>([]);
        const onChangeee = (e: ChangeEvent<HTMLInputElement>) => {
            const fileList = e.target.files; // Lấy danh sách các file
            const fileNames = []; // Mảng chứa tên của các file
            if (fileList) {
                for (let i = 0; i < fileList.length; i++) {
                    const fileName = fileList[i].name; // Lấy tên của từng file
                    fileNames.push(fileName); // Đưa tên của file vào mảng
                }
                setFiles(fileNames); // In ra tên của các file
                // Bạn có thể sử dụng fileNames để render ra trong React hoặc thực hiện các xử lý khác
            }
        };
        return (
            <div>
                {label && <p className='mb-2 font-medium text-800'>{label}</p>}

                <div className='border-round-xl bg-white border-1 border-solid border-300 relative overflow-hidden'>


                    <input
                        type='file'
                        value=''
                        accept={accept}
                        ref={inputRef}
                        multiple={multiple}
                        hidden={true}
                        onChange={(e) => { onChangeee(e), onChange(e) }}
                    />

                    {!disabled && (
                        <div
                            className='flex align-items-center gap-3 px-3 border-bottom-1 border-300'
                            style={{ height: 47 }}
                        >
                            <Button
                                rounded={true}
                                outlined={true}
                                icon='pi pi-fw pi-file'
                                className='w-2rem h-2rem'
                                onClick={(e) => {
                                    e.preventDefault();
                                    inputRef.current?.click();
                                }}
                            />
                            <Button
                                rounded={true}
                                outlined={true}
                                icon='pi pi-fw pi-trash'
                                severity='danger'
                                className='w-2rem h-2rem'
                                onClick={(e) => {
                                    e.preventDefault();
                                    onRemove();
                                    setFiles([]);
                                }}
                            />
                        </div>
                    )}

                    <div className='p-3 flex flex-wrap overflow-auto justify-content-between'>
                        <div>{placeholder}:{filesName.map((file, index) => <span key={index}>{file}</span>)}</div>
                        {filesName.length > 0 &&
                            <Button icon='pi pi-arrow-circle-down' label="Gửi file" onClick={onSubmitFile} severity="success" >
                            </Button>
                        }
                    </div>
                </div>
            </div>
        );
    },
);

InputFile.displayName = 'InputFile';

export { InputFile };
