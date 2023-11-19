import { UploadFile } from 'antd';
import { useState } from 'react';
import { RcFile } from 'antd/es/upload';

export const useUpload = () => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([] as UploadFile[]);
    const normFile = (e: { fileList: UploadFile[] }) => {
        return e?.fileList;
    };

    const getBase64 = (file: RcFile): Promise<string | ArrayBuffer> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = (await getBase64(file.originFileObj)) as string;
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(
            file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
        );
    };

    const handleChange = ({
        fileList: newFileList
    }: {
        fileList: UploadFile[];
    }) => setFileList(newFileList);

    const handleCancel = () => setPreviewOpen(false);

    return {
        normFile,
        previewOpen,
        previewImage,
        previewTitle,
        fileList,
        handlePreview,
        handleChange,
        handleCancel
    };
};
