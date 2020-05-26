import { useField, Field, useFormikContext } from "formik";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select, { SelectProps } from "@material-ui/core/Select";
import { Model } from "../database/getModels";
import useSWR from "swr";

export interface ModelSelectProps extends SelectProps {
  name: string;
  models: Model[];
  make: string;
}

export default function ModelSelect(props: ModelSelectProps) {
  const { name, models, make } = props;

  const { setFieldValue } = useFormikContext();

  const [field] = useField({ name: name });

  const { data } = useSWR<Model[]>(`/api/models?make=${make}`, {
    dedupingInterval: 60000,
    onSuccess: (newValues) => {
      if (!newValues.map((a) => a.model).includes(field.value)) {
        setFieldValue("model", "all");
      }
    },
  });

  const newModels = data || models;

  return (
    <FormControl variant="outlined" fullWidth>
      <InputLabel id="search-model">Model</InputLabel>

      <Select
        name="model"
        labelId="search-model"
        label="Model"
        {...field}
        {...props}
      >
        <MenuItem value="all">
          <em>All Models</em>
        </MenuItem>
        {newModels.map((model) => (
          <MenuItem key={model.model} value={model.model}>
            {`${model.model} (${model.count})`}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
