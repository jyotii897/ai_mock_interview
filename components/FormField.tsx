import { Control, Controller, FieldValues, Path } from "react-hook-form";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription, 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: "text" | "email" | "password";
  description?: string;
}
const FormField = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = "text",
  description,
}: FormFieldProps<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="label">{label}</FormLabel>
          <FormControl>
            <Input
              className="input"
              type={type}
              placeholder={placeholder}
              {...field}
            />
          </FormControl>
          {description && (
            <FormDescription className="text-light-100/50">
              {description}
            </FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
export default FormField;