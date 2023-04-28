import React from "react";
import ReactPDF, {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
} from "@react-pdf/renderer";
import View = ReactPDF.View;

Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "/fonts/Roboto-Regular.ttf",
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 40,
  },
  horizontalRule: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
  },
  section: {
    fontSize: 12,
    fontFamily: "Roboto",
    marginVertical: 10,
    lineHeight: 1.5,
  },
});

// NOTE: This should only ever be imported dynamically to reduce load times
const MyDocument: React.FC<{
  textSections: string[];
}> = ({ textSections }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {textSections.map((text) => (
        <>
          <Text style={styles.section}>{text}</Text>
          <HorizontalRule />
        </>
      ))}
    </Page>
  </Document>
);

const HorizontalRule: React.FC = () => <View style={styles.horizontalRule} />;

export default MyDocument;
