"use client";
import { Editor } from "reactjs-tiptap-editor";
import { useState } from "react";
import { FileUp } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@components/shares/rich-text-editor/components/dialog";
import FileField from "../file-field";
import { Button } from "@components/shares/rich-text-editor/components/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@components/shares/rich-text-editor/components/tooltip";
import { ApiFile } from "@components/shares/rich-text-editor/types/types";

const FileUploadButton = ({
  editor,
  onUploadFile,
  isUploadFilePending,
  baseUrl,
}: {
  editor: Editor;
  onUploadFile?: (file: File) => Promise<(ApiFile & { url: string }) | null>;
  isUploadFilePending?: boolean;
  baseUrl?: string;
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);

  const handleInsertImage = async (file: File) => {
    try {
      const uploadFileResult = await onUploadFile?.(file);
      if (uploadFileResult?.url) {
        editor
          .chain()
          .insertContent({
            type: "attachment",
            attrs: {
              url: `${baseUrl}${uploadFileResult.url}`,
              target: "_blank",
              fileName: file.name,
              fileSize: file.size,
            },
          })
          .run();
      }
      setOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" onClick={() => setOpen(true)}>
            <FileUp />
          </Button>
        </TooltipTrigger>
        <TooltipContent className="bg-white text-sm text-gray-900">
          <p>Tệp đính kèm</p>
        </TooltipContent>
      </Tooltip>
      <DialogContent
        className="sm:max-w-xl"
        onOpenAutoFocus={() => setFile(null)}
      >
        <DialogHeader>
          <DialogTitle>Thêm tệp đính kèm</DialogTitle>
          <DialogDescription>
            Hỗ trợ file có định dạng &apos;.doc&apos;, &apos;.docx&apos;,
            &apos;.pdf&apos;, &apos;.xls&apos;, &apos;.xlsx&apos;
            <br />
            Kích thước tối đa: 24MB
          </DialogDescription>
        </DialogHeader>
        <FileField
          value={file}
          onValueChange={(value) => setFile(value as File)}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Hủy</Button>
          </DialogClose>
          <Button
            onClick={() => handleInsertImage(file as File)}
            loading={isUploadFilePending}
            disabled={!file || isUploadFilePending}
          >
            Thêm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FileUploadButton;
