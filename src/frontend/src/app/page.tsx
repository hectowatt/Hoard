import Note from "@/components/note";
import styles from "./page.module.css";
import {
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  FormGroup,
  Paper,
} from "@mui/material";

export default function Home() {
  return (
    <Container>
      <Note />
    </Container>
  );
}