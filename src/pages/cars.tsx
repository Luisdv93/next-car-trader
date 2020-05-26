import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import deepEqual from "fast-deep-equal";
import { useState } from "react";
import Grid from "@material-ui/core/Grid";
import { stringify } from "querystring";
import useSWR from "swr";

import { getMakes, Make } from "../database/getMakes";
import { getModels, Model } from "../database/getModels";
import { getAsString } from "../getAsString";
import Search from ".";
import { CarModel } from "../../api/Car";
import { getPaginatedCars } from "../database/getPaginatedCars";
import { CardPagination } from "../components/CardPagination";
import { CarCard } from "../components/CarCard";

export interface CarsListProps {
  makes: Make[];
  models: Model[];
  cars: CarModel[];
  totalPages: number;
}

export default function CarsList(props: CarsListProps) {
  const { makes, models, cars, totalPages } = props;

  const { query } = useRouter();

  const [serverQuery] = useState(query);

  const { data } = useSWR(`/api/cars?${stringify(query)}`, {
    dedupingInterval: 15000,
    initialData: deepEqual(query, serverQuery)
      ? { cars, totalPages }
      : undefined,
  });

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={5} md={3} lg={2}>
        <Search makes={makes} models={models} singleColumn />
      </Grid>

      <Grid container item xs={12} sm={7} md={9} lg={10} spacing={3}>
        <Grid item xs={12}>
          <CardPagination totalPages={data?.totalPages} href="/cars" shallow />
        </Grid>

        {(data?.cars || []).map((car) => (
          <Grid key={car.id} item xs={12} sm={6}>
            <CarCard car={car} />
          </Grid>
        ))}

        <Grid item xs={12}>
          <CardPagination totalPages={data?.totalPages} href="/cars" shallow />
        </Grid>
      </Grid>
    </Grid>
  );
}

export const getServerSideProps: GetServerSideProps<CarsListProps> = async (
  ctx
) => {
  const make = getAsString(ctx.query.make);

  const [makes, models, pagination] = await Promise.all([
    getMakes(),
    getModels(make),
    getPaginatedCars(ctx.query),
  ]);

  return {
    props: {
      makes,
      models,
      cars: pagination.cars,
      totalPages: pagination.totalPages,
    },
  };
};
