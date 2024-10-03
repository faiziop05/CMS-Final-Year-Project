import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  FlatList,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { TableComponent, BackBtn } from "../../components";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/userSlice";
import { Colors } from "../../Colos";
import address from "../../IpAddress";

const Results = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [coursesData, setCoursesData] = useState([]);
  const [error, setError] = useState(null);
  const user = useSelector(selectUser);

  useEffect(() => {
    const fetchResultCards = async () => {
      try {
        const response = await axios.get(
          `http://${address}:3000/api/resultCard/get/${user.id}`
        );
        if (response.data.length === 0) {
          setError("No data found");
        } else {
          setCoursesData(response.data);
        }
      } catch (err) {
        if (err.response) {
          setError("No data found");
        } else {
          setError("Network error");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchResultCards();
  }, [user.id]);


  return (
    <View style={styles.container}>
      <BackBtn onClick={() => navigation.pop()} />
      <Text style={styles.ScreenHeadingText}>Result Card</Text>
      <View style={styles.ItemsWrapper}>
        {loading ? (
          <ActivityIndicator size="large" color={Colors.primary} />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <>
            <FlatList
              data={coursesData}
              renderItem={({ item }) => (
                <TableComponent
                  TableTitle={item.semesterName}
                  data={item.results}
                  gpa={item.semesterGPA}
                  cgpa={item.cumulativeGPA}
                />
              )}
              keyExtractor={(item) => item._id}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}
            />
          </>
        )}
      </View>
    </View>
  );
};

export default Results;

const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === "ios" ? 40 : 52,
    marginBottom: 5,
    flex: 1,
  },
  ItemsWrapper: {
    padding: 10,
    flex: 1,
  },
  ScreenHeadingText: {
    fontWeight: "900",
    fontSize: 25,
    color: "#3f3f3f",
    alignSelf: "center",
    marginBottom: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    // color: 'red',
    textAlign: "center",
    marginTop: "50%",
  },
});
