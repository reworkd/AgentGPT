/* eslint-disable @typescript-eslint/restrict-plus-operands */
import React from "react";
import ReactPDF, {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
} from "@react-pdf/renderer";
import View = ReactPDF.View;
import { i18n } from "next-i18next";

const fontUrl = {
  ru: "./fonts/Roboto-Regular.ttf",
  zh: "./fonts/SimSun.ttf",
  ja: "./fonts/japanese.ttf",
}[i18n?.language || "en"];

Font.register({
  family: "customfont",
  src: fontUrl as string,
});

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 40,
    wordBreak: "break-all",
  },
  horizontalRule: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
  },
  section: {
    fontSize: 12,
    fontFamily: "customfont",
    marginVertical: 10,
    lineHeight: 1.5,
    wordBreak: "break-all",
    paddingRight: 10,
  },
});

// NOTE: This should only ever be imported dynamically to reduce load times
const MyDocument: React.FC<{
  textSections: string[];
}> = ({ textSections }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {textSections.map((text, index) => (
        <>
          <Text key={index} style={styles.section}>
            {renderTextLines(text)}
          </Text>
          <HorizontalRule />
        </>
      ))}
    </Page>
  </Document>
);

const HorizontalRule: React.FC = () => <View style={styles.horizontalRule} />;

const renderTextLines = (text: string): React.ReactNode[] => {
  const MAX_LINE_LENGTH = 10;
  const lines: string[] = [];
  let start = 0;
  while (start < text.length) {
    const end = start + MAX_LINE_LENGTH;
    const line: string = text.slice(start, end);
    lines.push(line);
    start = end;
  }
  return lines.map((line: string, index) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>
  ));
};

export default MyDocument;
