import {StyleSheet} from "react-native";

const ExerciseUI = StyleSheet.create({
  poseOverlay: {
    position: "absolute", width: "100%", height: "100%"
  },
  pip: {
    width: 6, height: 6, backgroundColor: "#FFF", position: "absolute", top: 0, left: 0, borderRadius: 3
  },
  movementHeader: {
    top: 50,
    paddingLeft: 10,
    paddingRight: 10,
    width: "100%",
    position: "absolute",
    zIndex: 100,
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center"
  },
  movementHeaderText: {
    color: "#FFFFFF",
    fontSize: 24,
    alignSelf: "center"
  },
  movementHeaderCancelButton: {
    borderRadius: 20,
  },
  uiMsg: {
    fontSize: 30,
    color: "#FFF",
    margin: "auto",
    marginBottom: 5,
    textAlign: "center",
    borderRadius: 10,
    overflow:"hidden",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 20,
    paddingVertical:5
  },
  uiMsgMedium: {
    fontSize: 30,
    color: "#FFF",
    fontWeight: "bold",
    margin: "auto",
    marginBottom: 5,
    textAlign: "center",
    borderRadius: 5,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 5
  },
  uiMsgSmall: {
    fontSize: 20,
    color: "#FFF",
    margin: "auto",
    marginBottom: 5,
    textAlign: "center",
    borderRadius: 5,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 5
  },
  camera: {
    justifyContent: 'space-between',
    position: "relative",
    margin: 0,
    width: "100%",
    height: "100%"
  },

  overlayLandscape: {
    position: "absolute",
    padding: 10,
    flexDirection: "row",
    right: 0,
    width: 300,
    zIndex: 5
  },
  modalBg: {justifyContent: 'center', alignItems: 'center', width: "100%", height: "100%"},
  modalContentContainer: {
    width: "100%",
    height: "90%",
    borderRadius: 15,
    backgroundColor: "#EEE",
    borderColor: "#CCC"
  },
  modalContent: {
    height: "100%",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    padding: 15,
    backgroundColor: "#FFF",
    borderColor: "#CCC"
  },
  modalTitleWrapper: {
    fontWeight: "bold",
    textAlign: "center",
    borderRadius: 15,
    height: 80,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10
  },
  modalTitle: {
    color: "#333",
    fontSize: 24,
    marginBottom: 10,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "Archivo_bold"
  },
});

export default ExerciseUI;
