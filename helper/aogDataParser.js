module.exports.actionDataToAog = {
  actionName: "",
  data: "",
  isSended: false,
  isChanged: false,
};

var prevSectionIDs = [sectionHelper];

var position = {
  lat: 22.487,
  lon: 50.23,
};

var section = {
  pointLeft: position,
  pointRight: position,
  sectionId: 0,
};

var sections = [section];

var sectionHelper = {
  sectionId: 0,
  isClosed: false,
  sectionNumber: 0,
};
var currentSectionIDs = [sectionHelper];
var maxSectionNumber = 0;

function parseSectionsFromAog(aog_sections) {
  //var aog_sections = JSON.parse(data);
  currentSectionIDs = [];
  sections = [];
  for (let sect of aog_sections) {
    let sectionId = 0;
    let foundSection = {};
    if (prevSectionIDs.length > 1) {
      foundSection = prevSectionIDs.find(
        (x) => x.sectionNumber === sect.sectionNumber
      );
    }
    if (
      foundSection &&
      ((!foundSection.isClosed && sect.isSectionOn) ||
        (!foundSection.isClosed && !sect.isSectionOn) ||
        (foundSection.isClosed && !sect.isSectionOn))
    ) {
      sectionId = foundSection.sectionId;
      foundSection.isClosed = !sect.isSectionOn;
      currentSectionIDs.push(foundSection);
    } else {
      maxSectionNumber++;
      sectionHelper.sectionId = maxSectionNumber;
      sectionHelper.sectionNumber = sect.sectionNumber;
      sectionHelper.isClosed = !sect.isSectionOn;
      currentSectionIDs.push({ ...sectionHelper });
    }

    //add section
    section.pointLeft = {
      lat: sect.leftPointLat,
      lon: sect.leftPointLon,
    };
    section.pointRight = {
      lat: sect.rightPointLat,
      lon: sect.rightPointLon,
    };
    section.sectionId = sectionId;
    section.sectionNumber = sect.sectionNumber;
    section.buttonState = sect.buttonState;
    section.isSectionOn = sect.isSectionOn;

    sections.push({ ...section });
  }
  prevSectionIDs = [...currentSectionIDs];
  // console.log("prevSectionIDs");
  // console.log(prevSectionIDs);
  return sections;
}

const parseRawData = (data) => {
  let aog_data = JSON.parse(data);
  let parsedSections = parseSectionsFromAog(aog_data.sections);
  let timestampArray = aog_data.timestamp.split(".");

  return {
    dataInfo: {
      timestamp: timestampArray[0],
    },
    controlButtonsState: {
      buttonAutoState: aog_data.buttonAutoState,
      buttonManState: aog_data.buttonManState,
      autoSteerButtonState: aog_data.buttonAutoSteerState,
      uTurnButtonState: aog_data.uTurnButtonState,
      lineABButtonState: aog_data.lineABButtonState,
      curveLineButtonState: aog_data.curveLineButtonState,
      hydraulicLiftButtonState: aog_data.hydraulicLiftButtonState,
      headlandButtonState: aog_data.headlandButtonState,
      skipRowComboBoxState: aog_data.skipRowComboBoxState,
      distanceNavigationError: aog_data.distanceNavigationError,
      vehicleSetSteerAngel: aog_data.vehicleSetSteerAngel,
      vehicleActualSteerAngel: aog_data.vehicleActualSteerAngel,
      isJobOn: aog_data.isJobOn,
      isOnField: aog_data.isOnField,
      isUTurnTriggered: aog_data.isUTurnTriggered,
      isBoundaryOn: aog_data.isBoundaryOn,
    },
    vehicle: {
      heading: aog_data.heading,
      lon: aog_data.vehicleLon,
      lat: aog_data.vehicleLat,
    },
    sections: parsedSections,
  };
};

exports.parseRawData = parseRawData;
