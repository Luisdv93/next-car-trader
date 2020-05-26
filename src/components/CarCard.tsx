import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";

import { CarModel } from "../../api/Car";
import Link from "next/link";

export interface CarCardProps {
  car: CarModel;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    media: {
      height: 0,
      paddingTop: "56.25%", // 16:9
    },
    expandOpen: {
      transform: "rotate(180deg)",
    },
    header: {
      fontWeight: "bold",
      color: "#000",
    },
    avatar: {
      backgroundColor: theme.palette.primary.main,
    },
    anchorTag: {
      textDecoration: "none",
    },
  })
);

export const CarCard = (props: CarCardProps) => {
  const { car } = props;

  const classes = useStyles();

  return (
    <Card elevation={5}>
      <Link
        href={"/cars/[make]/[model]/[id]"}
        as={`/cars/${car.make}/${car.model}/${car.id}`}
      >
        <a className={classes.anchorTag}>
          <CardHeader
            avatar={
              <Avatar
                aria-label="Car Title"
                className={classes.avatar}
              >{`${car.make[0]}${car.model[0]}`}</Avatar>
            }
            title={`${car.make} ${car.model}`}
            subheader={`$${car.price}`}
            subheaderTypographyProps={{ className: classes.header }}
            className={classes.header}
          />
          <CardMedia
            className={classes.media}
            image={car.photoUrl}
            title={`${car.make} ${car.model} Photo`}
          />
        </a>
      </Link>

      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {car.details}
        </Typography>
      </CardContent>
    </Card>
  );
};
