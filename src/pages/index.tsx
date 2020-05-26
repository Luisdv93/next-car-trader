import { GetServerSideProps } from "next";
import router, { useRouter } from "next/router";
import { Formik, Form, Field } from "formik";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import { makeStyles } from "@material-ui/core/styles";

import { getMakes, Make } from "../database/getMakes";
import { Model, getModels } from "../database/getModels";
import { getAsString } from "../getAsString";
import ModelSelect from "../components/ModelSelect";

const prices = [500, 1000, 5000, 15000, 25000, 50000, 250000];

export interface SearchProps {
  makes: Make[];
  models: Model[];
  singleColumn?: boolean;
}

const useStyles = makeStyles((theme) => ({
  paper: {
    margin: "auto",
    maxWidth: 500,
    padding: theme.spacing(3),
  },
}));

export default function Search(props: SearchProps) {
  const { makes, models, singleColumn } = props;

  const smValue = singleColumn ? 12 : 6;

  const { query } = useRouter();

  const classes = useStyles();

  const initialValues = {
    make: getAsString(query.make) || "all",
    model: getAsString(query.model) || "all",
    minPrice: getAsString(query.minPrice) || "all",
    maxPrice: getAsString(query.maxPrice) || "all",
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => {
        router.push(
          {
            pathname: "/cars",
            query: { ...values, page: 1 },
          },
          undefined,
          { shallow: true }
        );
      }}
    >
      {({ values }) => (
        <Form>
          <Paper elevation={5} className={classes.paper}>
            <Grid container spacing={3}>
              <Grid xs={12} sm={smValue} item>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel id="search-make">Make</InputLabel>

                  <Field
                    name="make"
                    labelId="search-make"
                    label="Make"
                    as={Select}
                  >
                    <MenuItem value="all">
                      <em>All Makes</em>
                    </MenuItem>
                    {makes.map((make) => (
                      <MenuItem key={make.make} value={make.make}>
                        {`${make.make} (${make.count})`}
                      </MenuItem>
                    ))}
                  </Field>
                </FormControl>
              </Grid>

              <Grid xs={12} sm={smValue} item>
                <ModelSelect name="model" models={models} make={values.make} />
              </Grid>

              <Grid xs={12} sm={smValue} item>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel id="search-min-price">Min. Price</InputLabel>

                  <Field
                    name="minPrice"
                    labelId="search-min-price"
                    label="Min. Price"
                    as={Select}
                  >
                    <MenuItem value="all">
                      <em>No Minimum</em>
                    </MenuItem>
                    {prices.map((price) => (
                      <MenuItem key={price} value={price}>
                        {price}
                      </MenuItem>
                    ))}
                  </Field>
                </FormControl>
              </Grid>

              <Grid xs={12} sm={smValue} item>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel id="search-max-price">Max. Price</InputLabel>

                  <Field
                    name="maxPrice"
                    labelId="search-max-price"
                    label="Max. Price"
                    as={Select}
                  >
                    <MenuItem value="all">
                      <em>No Maximum</em>
                    </MenuItem>
                    {prices.map((price) => (
                      <MenuItem key={price} value={price}>
                        {price}
                      </MenuItem>
                    ))}
                  </Field>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  type="submit"
                  fullWidth
                  color="primary"
                >
                  Search
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Form>
      )}
    </Formik>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const make = getAsString(ctx.query.make);

  const [makes, models] = await Promise.all([getMakes(), getModels(make)]);

  return { props: { makes, models } };
};
