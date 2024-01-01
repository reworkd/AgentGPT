import ReactPDF, { Document, Font, Page, StyleSheet, Text } from "@react-pdf/renderer";
import { i18n } from "next-i18next";
import React from "react";

import View = ReactPDF.View;

const getFontUrlForLanguageCode = (languageCode: string) => {
  switch (languageCode) {
    case "en":
      return ""; // Do not use a custom font for english
    case "zh":
      return "/fonts/SimSun.ttf";
    case "ja":
      return "/fonts/Nasu-Regular.ttf";
    case "ko":
      return "/fonts/NanumMyeongjo-Regular.ttf";
    default:
      return "/fonts/Roboto-Regular.ttf";
  }
};

const getFontUrl = () => getFontUrlForLanguageCode(i18n?.language || "en");

Font.register({
  family: "customFont",
  src: getFontUrl(),
});

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 40,
    wordBreak: "break-all",
  },
  horizontalRule: {
    borderBottomWidth: 0.3,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
  },
  section: {
    fontSize: 10,
    ...(getFontUrl() == "" ? {} : { fontFamily: "customFont" }),
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
