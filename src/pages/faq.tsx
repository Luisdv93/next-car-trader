import { GetStaticProps } from "next";
import { openDB } from "../openDB";
import { FaqModel } from "../../api/Faq";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

interface FaqProps {
  faq: FaqModel[];
}

export default function Faq({ faq }: FaqProps) {
  return (
    <div>
      {faq.map((f) => (
        <ExpansionPanel key={f.id}>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>{f.question}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>{f.answer}</Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      ))}
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const db = await openDB();

  const faq = await db.all("SELECT * FROM FAQ ORDER BY createDate DESC");

  return { props: { faq } };
};
