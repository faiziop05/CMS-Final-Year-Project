import React from "react";
import { View, Text, StyleSheet, FlatList, ScrollView } from "react-native";

const TableComponent = ({ TableTitle, data, gpa, cgpa }) => {
  const renderData = (item) => {
    return (
      <View style={styles.row}>
        <Text style={styles.cell}>{item.courseId.courseCode}</Text>
        <Text style={[styles.cell, { width: 200 }]}>
          {item.courseId.courseName}
        </Text>
        <Text style={styles.cell}>{item.creditHours}</Text>
        <Text style={styles.cell}>{item.gainedMarks}</Text>
        <Text style={styles.cell}>{item.lg}</Text>
        <Text style={styles.cell}>{parseFloat(item.gp).toFixed(2)}</Text>
        <Text style={styles.cell}>{parseFloat(item.cp).toFixed(2)}</Text>
      </View>
    );
  };

  return (
    <ScrollView horizontal style={styles.container}>
      <View>
        <Text style={styles.TableHeading}>{TableTitle}</Text>
        <View style={styles.headingRowWrapper}>
          <Text style={styles.headingRowText}>Course No </Text>
          <Text style={[styles.headingRowText, { width: 200 }]}>
            Course Title
          </Text>
          <Text style={styles.headingRowText}>Credit</Text>
          <Text style={styles.headingRowText}>Marks</Text>
          <Text style={styles.headingRowText}>LG</Text>
          <Text style={styles.headingRowText}>GP</Text>
          <Text style={styles.headingRowText}>CP</Text>
        </View>
        <FlatList data={data} renderItem={({ item }) => renderData(item)} />
        <View
          style={{ flexDirection: "row", marginHorizontal: 10, padding: 10 }}
        >
          <Text style={styles.CGPAGPAHeading}>CGPA: </Text>
          <Text style={[styles.CGPAGPAText, { marginRight: 50 }]}>
            {parseFloat(cgpa).toFixed(2)}{" "}
          </Text>
          <Text style={styles.CGPAGPAHeading}>GPA: </Text>
          <Text style={styles.CGPAGPAText}>{parseFloat(gpa).toFixed(2)} </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default TableComponent;

const styles = StyleSheet.create({
  container: {
    marginBottom: 50,
  },
  TableHeading: {
    fontWeight: "600",
    fontSize: 20,
    color: "#143782",
    marginHorizontal: 10,
  },
  headingRowWrapper: {
    flexDirection: "row",
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    padding: 10,
  },
  headingRowText: {
    width: 100,
    fontWeight: "bold",
    color: "#000",
  },
  cell: {
    textAlign: "left",
    color: "#000",
    width: 100,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
    marginHorizontal: 2,
    elevation: 1,
    borderRadius: 3,
    borderColor: "#fff",
    padding: 10,
    backgroundColor: "#fff",
  },
  CGPAGPAHeading: {
    fontWeight: "600",
  },
  CGPAGPAText: {},
});
