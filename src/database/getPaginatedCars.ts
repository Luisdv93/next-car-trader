import { ParsedUrlQuery } from "querystring";
import { openDB } from "../openDB";
import { CarModel } from "../../api/Car";
import { getAsString } from "../getAsString";

const mainQuery = `
  FROM car
  WHERE (@make is NULL or @make = make)
  AND (@model is NULL or @model = model)
  AND (@minPrice is NULL or @minPrice <= price)
  AND (@maxPrice is NULL or @maxPrice >= price)
  `;

export async function getPaginatedCars(query: ParsedUrlQuery) {
  const db = await openDB();

  const page = getValueNumber(query.page) || 1;
  const rowsPerPage = getValueNumber(query.rowsPerPage) || 4;
  const offset = (page - 1) * rowsPerPage;

  const dbParams = {
    "@make": getValueString(query.make),
    "@model": getValueString(query.model),
    "@minPrice": getValueNumber(query.minPrice),
    "@maxPrice": getValueNumber(query.maxPrice),
    "@rowsPerPage": rowsPerPage,
    "@offset": offset,
  };

  const totalParams = {
    "@make": getValueString(query.make),
    "@model": getValueString(query.model),
    "@minPrice": getValueNumber(query.minPrice),
    "@maxPrice": getValueNumber(query.maxPrice),
  };

  const carsPromise = db.all<CarModel[]>(
    `SELECT * ${mainQuery} LIMIT @rowsPerPage OFFSET @offset`,
    dbParams
  );

  const totalRowsPromise = db.get<{ count: number }>(
    `SELECT COUNT(*) as count ${mainQuery}`,
    totalParams
  );

  const [cars, totalRows] = await Promise.all([carsPromise, totalRowsPromise]);

  return { cars, totalPages: Math.ceil(totalRows.count / rowsPerPage) };
}

function getValueNumber(value: string | string[]) {
  const str = getValueString(value);
  const number = parseInt(str);

  return isNaN(number) ? null : number;
}

function getValueString(value: string | string[]) {
  const str = getAsString(value);

  return !str || str.toLowerCase() === "all" ? null : str;
}
