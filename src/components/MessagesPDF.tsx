import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { Message } from "./ChatWindow";

// Create styles
const styles = StyleSheet.create({
  page: { flexDirection: "row", backgroundColor: "#ffffff" },
  section: { margin: 10, padding: 10, flexGrow: 1 },
  text: { color: "#000000" },
});

// Create Messages PDF Document Component
const MessagesPDF = ({ messages }: { messages: Message[] }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        {messages.map((message) => (
          <Text style={styles.text}>
            {message.type}: {message.value}
          </Text>
        ))}
      </View>
    </Page>
  </Document>
);

const DownloadPDF = (name: string, mm: Message[]) => {
  return (
    <PDFDownloadLink document={<MessagesPDF messages={mm} />} fileName={name}>
      {({ blob, url, loading, error }) =>
        loading ? "Loading PDF document..." : "Download PDF"
      }
    </PDFDownloadLink>
  );
};

export default DownloadPDF;
