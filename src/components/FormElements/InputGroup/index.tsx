// import { cn } from "@/lib/utils";
// import { type HTMLInputTypeAttribute, useId } from "react";
//
// type InputGroupProps = {
//   className?: string;
//   label?: string;
//   placeholder: string;
//   type: HTMLInputTypeAttribute;
//   fileStyleVariant?: "style1" | "style2";
//   required?: boolean;
//   disabled?: boolean;
//   active?: boolean;
//   onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   value?: string;
//   name?: string;
//   icon?: React.ReactNode;
//   iconPosition?: "left" | "right";
//   height?: "sm" | "default";
//   defaultValue?: string;
//   onClick?: any
// };
//
// const InputGroup: React.FC<InputGroupProps> = ({
//                                                  className,
//                                                  label,
//                                                  type,
//                                                  placeholder,
//                                                  required,
//                                                  disabled,
//                                                  active,
//                                                  onChange,
//                                                  icon,
//                                                  value,
//                                                  name,
//                                                  iconPosition,
//                                                  height,
//                                                  defaultValue,
//                                                  fileStyleVariant,
//                                                  onClick,
//                                                  ...rest
//                                                }) => {
//   const id = useId();
//
//   return (
//     <div className={className}>
//       {label && (
//         <label
//           htmlFor={id}
//           className="text-body-sm font-medium text-dark dark:text-white"
//         >
//           {label}
//           {required && <span className="ml-1 select-none text-red">*</span>}
//         </label>
//       )}
//
//       <div
//         className={cn(
//           "relative mt-3 [&_svg]:absolute [&_svg]:top-1/2 [&_svg]:-translate-y-1/2",
//           iconPosition === "left"
//             ? "[&_svg]:left-4.5"
//             : "[&_svg]:right-4.5"
//         )}
//       >
//         <input
//           id={id}
//           type={type}
//           name={name}
//           placeholder={placeholder}
//           onChange={onChange}
//           value={value}
//           defaultValue={defaultValue}
//           className={cn(
//             "w-full rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition focus:border-primary disabled:cursor-default disabled:bg-gray-2 data-[active=true]:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary dark:disabled:bg-dark dark:data-[active=true]:border-primary",
//             type === "file"
//               ? getFileStyles(fileStyleVariant || "style2")
//               : "px-5.5 py-3 text-dark placeholder:text-dark-6 dark:text-white",
//             iconPosition === "left" && "pl-12.5",
//             height === "sm" && "py-2.5",
//           )}
//           required={required}
//           disabled={disabled}
//           data-active={active}
//           onClick={onClick}
//           {...rest}
//         />
//
//         {icon}
//       </div>
//     </div>
//   );
// };
//
// export default InputGroup;
//
// function getFileStyles(variant: "style1" | "style2") {
//   switch (variant) {
//     case "style1":
//       return `file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-[#E2E8F0] file:px-6.5 file:py-[13px] file:text-body-sm file:font-medium file:text-dark-5 file:hover:bg-primary file:hover:bg-opacity-10 dark:file:border-dark-3 dark:file:bg-white/30 dark:file:text-white`;
//     default:
//       return `file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-stroke file:px-2.5 file:py-1 file:text-body-xs file:font-medium file:text-dark-5 file:focus:border-primary dark:file:border-dark-3 dark:file:bg-white/30 dark:file:text-white px-3 py-[9px]`;
//   }
// }

import { cn } from "@/lib/utils";
import { type HTMLInputTypeAttribute, useId, forwardRef } from "react";

type InputGroupProps = {
  className?: string;
  label?: string;
  placeholder: string;
  type: HTMLInputTypeAttribute;
  fileStyleVariant?: "style1" | "style2";
  required?: boolean;
  disabled?: boolean;
  active?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  name?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  height?: "sm" | "default";
  defaultValue?: string;
  onClick?: any;
  accept?: string;
  ref?: React.Ref<HTMLInputElement>;
};

const InputGroup = forwardRef<HTMLInputElement, InputGroupProps>(({
                                                                    className,
                                                                    label,
                                                                    type,
                                                                    placeholder,
                                                                    required,
                                                                    disabled,
                                                                    active,
                                                                    onChange,
                                                                    icon,
                                                                    value,
                                                                    name,
                                                                    iconPosition,
                                                                    height,
                                                                    defaultValue,
                                                                    fileStyleVariant,
                                                                    onClick,
                                                                    accept,
                                                                    ...rest
                                                                  }, ref) => {
  const id = useId();

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={id}
          className="text-body-sm font-medium text-dark dark:text-white"
        >
          {label}
          {required && <span className="ml-1 select-none text-red">*</span>}
        </label>
      )}

      <div
        className={cn(
          "relative mt-3 [&_svg]:absolute [&_svg]:top-1/2 [&_svg]:-translate-y-1/2",
          iconPosition === "left"
            ? "[&_svg]:left-4.5"
            : "[&_svg]:right-4.5"
        )}
      >
        <input
          id={id}
          type={type}
          name={name}
          placeholder={placeholder}
          onChange={onChange}
          value={value}
          defaultValue={defaultValue}
          className={cn(
            "w-full rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition focus:border-primary disabled:cursor-default disabled:bg-gray-2 data-[active=true]:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary dark:disabled:bg-dark dark:data-[active=true]:border-primary",
            type === "file"
              ? getFileStyles(fileStyleVariant || "style2")
              : "px-5.5 py-3 text-dark placeholder:text-dark-6 dark:text-white",
            iconPosition === "left" && "pl-12.5",
            height === "sm" && "py-2.5",
          )}
          required={required}
          disabled={disabled}
          data-active={active}
          onClick={onClick}
          accept={accept}
          ref={ref}
          {...rest}
        />

        {icon}
      </div>
    </div>
  );
});

// Đặt tên hiển thị cho component (hữu ích cho React DevTools)
InputGroup.displayName = "InputGroup";

export default InputGroup;

function getFileStyles(variant: "style1" | "style2") {
  switch (variant) {
    case "style1":
      return `file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-[#E2E8F0] file:px-6.5 file:py-[13px] file:text-body-sm file:font-medium file:text-dark-5 file:hover:bg-primary file:hover:bg-opacity-10 dark:file:border-dark-3 dark:file:bg-white/30 dark:file:text-white`;
    default:
      return `file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-stroke file:px-2.5 file:py-1 file:text-body-xs file:font-medium file:text-dark-5 file:focus:border-primary dark:file:border-dark-3 dark:file:bg-white/30 dark:file:text-white px-3 py-[9px]`;
  }
}