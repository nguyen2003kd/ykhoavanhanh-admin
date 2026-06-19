"use client";

import {
  memo,
  useLayoutEffect,
  useState,
  // useMemo,
  ButtonHTMLAttributes,
  RefObject,
  Fragment,
  ComponentPropsWithRef,
  HTMLAttributes,
} from "react";
import RichTextEditor, { BaseKit, Editor } from "reactjs-tiptap-editor";
import { Blockquote } from "reactjs-tiptap-editor/blockquote";
import { Bold } from "reactjs-tiptap-editor/bold";
import { BulletList } from "reactjs-tiptap-editor/bulletlist";
import { Clear } from "reactjs-tiptap-editor/clear";
import { Color } from "reactjs-tiptap-editor/color";
import { ColumnActionButton } from "reactjs-tiptap-editor/multicolumn";
import { Emoji } from "reactjs-tiptap-editor/emoji";
import { FontFamily } from "reactjs-tiptap-editor/fontfamily";
import { FontSize } from "reactjs-tiptap-editor/fontsize";
import { FormatPainter } from "reactjs-tiptap-editor/formatpainter";
import { Heading } from "reactjs-tiptap-editor/heading";
import { Highlight } from "reactjs-tiptap-editor/highlight";
import { History } from "reactjs-tiptap-editor/history";
import { HorizontalRule } from "reactjs-tiptap-editor/horizontalrule";
import { Indent } from "reactjs-tiptap-editor/indent";
import { Italic } from "reactjs-tiptap-editor/italic";
import { LineHeight } from "reactjs-tiptap-editor/lineheight";
import { Link } from "reactjs-tiptap-editor/link";
import { MoreMark } from "reactjs-tiptap-editor/moremark";
import { OrderedList } from "reactjs-tiptap-editor/orderedlist";
import { SearchAndReplace } from "reactjs-tiptap-editor/searchandreplace";
import { Strike } from "reactjs-tiptap-editor/strike";
import { Table } from "reactjs-tiptap-editor/table";
import { TableOfContents } from "reactjs-tiptap-editor/tableofcontent";
import { TaskList } from "reactjs-tiptap-editor/tasklist";
import { TextAlign } from "reactjs-tiptap-editor/textalign";
import { TextUnderline } from "reactjs-tiptap-editor/textunderline";
import { TextDirection } from "reactjs-tiptap-editor/textdirection";
import { Video } from "reactjs-tiptap-editor/video";
import { Image } from "reactjs-tiptap-editor/image";
import { Attachment } from "reactjs-tiptap-editor/attachment";
import { locale } from "reactjs-tiptap-editor/locale-bundle";
import "reactjs-tiptap-editor/style.css";
import "./text-editor.css";

// Radix UI
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import {
  Root as DialogRoot,
  // Trigger,
  Portal,
  Close,
  Overlay,
  Content,
  Title,
  Description,
} from "@radix-ui/react-dialog";
import { Slot } from "@radix-ui/react-slot";

// Icons
import { X, FileUp, File, XCircleIcon, LoaderCircle } from "lucide-react";

// Utils
import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";
import { cva, type VariantProps } from "class-variance-authority";
import Dropzone from "react-dropzone";

// ============================================
// INLINE: cn utility
// ============================================
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ============================================
// INLINE: ApiFile type
// ============================================
type ApiFile = {
  _id: string;
  path: string;
  original: string;
  mime: string;
  compress_info: Record<
    string,
    {
      ext: string;
      size: number;
    }
  >;
};

// ============================================
// INLINE: Separator component
// ============================================
const Separator = ({
  ref,
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentPropsWithRef<typeof SeparatorPrimitive.Root>) => (
  <SeparatorPrimitive.Root
    ref={ref}
    decorative={decorative}
    orientation={orientation}
    className={cn(
      "bg-border shrink-0",
      orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
      className,
    )}
    {...props}
  />
);

// ============================================
// INLINE: Button component
// ============================================
const buttonVariants = cva(
  "cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-primary hover:text-secondary",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-accent-information underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

interface ButtonProps
  extends
  ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  ref?: RefObject<HTMLButtonElement>;
  asChild?: boolean;
  loading?: boolean;
}

const Button = ({
  ref,
  className,
  variant,
  size,
  disabled,
  children,
  loading = false,
  type = "button",
  asChild = false,
  ...props
}: ButtonProps) => {
  const isDisabled = loading ? true : disabled;
  const Comp = asChild ? Slot : "button";
  const Children = loading ? (
    <Fragment>
      <LoaderCircle className="size-4 animate-spin" />
      {children}
    </Fragment>
  ) : (
    children
  );

  return (
    <Comp
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      type={type}
      disabled={isDisabled}
      {...props}
    >
      {Children}
    </Comp>
  );
};

// ============================================
// INLINE: Tooltip components
// ============================================
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;
const TooltipContent = ({
  ref,
  className,
  sideOffset = 4,
  ...props
}: React.ComponentPropsWithRef<typeof TooltipPrimitive.Content>) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 overflow-hidden rounded-md px-3 py-1.5 text-xs",
        className,
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
);

// ============================================
// INLINE: Dialog components
// ============================================
const Dialog = DialogRoot;
const DialogClose = Close;

const DialogOverlay = ({
  ref,
  className,
  ...props
}: ComponentPropsWithRef<typeof Overlay>) => (
  <Overlay
    ref={ref}
    className={cn(
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80",
      className,
    )}
    {...props}
  />
);

const DialogContent = ({
  ref,
  className,
  children,
  ...props
}: ComponentPropsWithRef<typeof Content>) => (
  <Portal>
    <DialogOverlay />
    <Content
      ref={ref}
      className={cn(
        "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] fixed top-[50%] left-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border p-6 shadow-lg duration-200 sm:rounded-lg",
        className,
      )}
      {...props}
    >
      {children}
      <Close className="dialog-close-button ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </Close>
    </Content>
  </Portal>
);

const DialogHeader = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className,
    )}
    {...props}
  />
);

const DialogFooter = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className,
    )}
    {...props}
  />
);

const DialogTitle = ({
  ref,
  className,
  ...props
}: ComponentPropsWithRef<typeof Title>) => (
  <Title
    ref={ref}
    className={cn(
      "text-lg leading-none font-semibold tracking-tight",
      className,
    )}
    {...props}
  />
);

const DialogDescription = ({
  ref,
  className,
  ...props
}: ComponentPropsWithRef<typeof Description>) => (
  <Description
    ref={ref}
    className={cn("text-muted-foreground text-sm", className)}
    {...props}
  />
);

// ============================================
// INLINE: FileField component
// ============================================
interface FileFieldProps {
  value: File | null;
  onValueChange: (value: File | null) => void;
  disabled?: boolean;
  className?: string;
}

function FileField({
  value,
  onValueChange,
  disabled,
  className,
}: FileFieldProps) {
  return (
    <div className={className}>
      <div className="grid grid-cols-3 items-center gap-4">
        <Dropzone
          onDrop={(acceptedFiles) => {
            const file = acceptedFiles[0] as File;
            if (file) {
              onValueChange(file);
            }
          }}
          accept={{
            document: [".doc", ".docx", ".pdf", ".xls", ".xlsx"],
          }}
          maxFiles={1}
          maxSize={24 * 1024 * 1024} //24MB
          disabled={disabled}
        >
          {({
            getRootProps,
            getInputProps,
            isDragActive,
            isDragAccept,
            isDragReject,
          }) => (
            <div
              {...getRootProps()}
              className={cn(
                "focus:border-primary flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-gray-500 py-4 text-center focus:outline-hidden",
                {
                  "border-primary bg-secondary": isDragActive && isDragAccept,
                  "border-destructive bg-destructive/20":
                    isDragActive && isDragReject,
                },
              )}
            >
              <input {...getInputProps()} id="profile" />
              <FileUp size={48} strokeWidth={1.25} />
              <span className="mt-1 text-xs text-gray-500">
                Kéo thả file hoặc click để chọn file
              </span>
            </div>
          )}
        </Dropzone>
        <div
          className={cn(
            "relative col-span-2",
            disabled ? "pointer-events-none" : "",
          )}
        >
          {value && (
            <div className="rounded-md border border-gray-300 p-2">
              <button
                type="button"
                className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2"
                onClick={() => onValueChange(null)}
              >
                <XCircleIcon className="h-5 w-5 bg-white" />
              </button>
              <div className="flex items-center gap-2">
                <File />
                <p className="line-clamp-1">{value?.name}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// INLINE: FileUploadButton component
// ============================================
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

// ============================================
// MAIN: TextEditor component
// ============================================
interface TextEditorProps {
  content: string;
  onChangeContent: (content: string) => void;
  contentClassName?: string;
  uploadFile?: {
    onUpload: (file: File) => Promise<(ApiFile & { url: string }) | null>;
    isLoading: boolean;
    baseUrl: string;
    acceptMimes?: string[];
  };
}

export const TextEditor: React.FC<TextEditorProps> = memo(
  ({ content, onChangeContent, contentClassName, uploadFile }) => {
    useLayoutEffect(() => {
      setTimeout(() => {
        locale.setLang("vi");
      }, 0);
    }, []);

    return (
      <RichTextEditor
        output="html"
        content={content}
        onChangeContent={onChangeContent}
        contentClass={cn("overflow-y-auto rte-editor-content", contentClassName)}
        extensions={[
          BaseKit.configure({
            placeholder: { placeholder: "Nhập nội dung..." },
          }),
          History,
          SearchAndReplace,
          TableOfContents,
          FormatPainter.configure({ spacer: true }),
          Clear,
          FontFamily,
          Heading.configure({ spacer: true }),
          FontSize,
          Bold,
          Italic,
          TextUnderline,
          Strike,
          MoreMark,
          Emoji,
          Color.configure({ spacer: true }),
          Highlight,
          BulletList,
          OrderedList,
          TextAlign.configure({
            types: ["heading", "paragraph"],
            spacer: true,
          }),
          Indent,
          LineHeight,
          TaskList.configure({
            spacer: true,
            taskItem: { nested: true },
          }),
          Link,
          Blockquote,
          HorizontalRule,
          ColumnActionButton,
          Table,
          TextDirection,
          Video.configure({
            upload: async (file: File) => {
              const res = await uploadFile?.onUpload(file);
              if (!res) throw new Error("Error on mutation");
              return `${uploadFile?.baseUrl}${res.url}`;
            },
          }),
          Image.configure({
            upload: async (file: File) => {
              const res = await uploadFile?.onUpload(file);
              if (!res) throw new Error("Error on mutation");
              return `${uploadFile?.baseUrl}${res.url}`;
            },
            acceptMimes: uploadFile?.acceptMimes ?? [
              ".png",
              ".jpeg",
              ".webp",
              ".jpg",
              ".svg",
            ],
          }),
          Attachment,
        ]}
        dark={false}
        toolbar={{
          render: (props, toolbarItems, _, containerDom) => {
            const extendDom = toolbarItems
              .filter((item) => item.name !== "attachment")
              .map((item, key) => {
                const ButtonComponent = item.button.component;
                // Strip tooltipOptions to prevent React warning about unknown DOM props
                // The library has a bug where this prop leaks to native DOM elements
                const {  ...buttonProps } = item.button.componentProps ?? {};

                return (
                  <div
                    className="richtext-flex richtext-items-center"
                    key={`toolbar-item-${key}`}
                  >
                    {item?.spacer && (
                      <Separator
                        orientation="vertical"
                        className="!richtext-h-[16px] !richtext-mx-[10px]"
                      />
                    )}

                    <ButtonComponent
                      {...buttonProps}
                      tooltipOptions={undefined}
                    />

                    {item?.divider && (
                      <Separator
                        orientation="vertical"
                        className="!richtext-h-auto !richtext-mx-2"
                      />
                    )}
                  </div>
                );
              });
            return containerDom([
              ...extendDom,
              <FileUploadButton
                key="file-upload-button"
                editor={props.editor}
                onUploadFile={uploadFile?.onUpload}
                isUploadFilePending={uploadFile?.isLoading}
                baseUrl={uploadFile?.baseUrl}
              />,
            ]);
          },
        }}
      />
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.content === nextProps.content &&
      prevProps.onChangeContent === nextProps.onChangeContent &&
      prevProps.contentClassName === nextProps.contentClassName &&
      prevProps.uploadFile?.onUpload === nextProps.uploadFile?.onUpload &&
      prevProps.uploadFile?.isLoading === nextProps.uploadFile?.isLoading &&
      prevProps.uploadFile?.baseUrl === nextProps.uploadFile?.baseUrl
    );
  }
);

TextEditor.displayName = "TextEditor";
