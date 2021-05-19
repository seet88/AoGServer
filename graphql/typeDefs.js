const typeDefs = `
      type Vehicle{
         heading: Float!
         lat: Float!
         lon: Float!
      }

      type Point{
        lat: Float!
        lon: Float!
      }

      type Section{
        pointLeft: Point!
        pointRight: Point!
        sectionId: Int!
        sectionNumber: Int
        buttonState: String
        isSectionOn: Boolean
      }      

      type DataInfo{
        timestamp: String
      }

      type ControlButtonsState{
        buttonAutoState: String
        buttonManState: String
        autoSteerButtonState: Boolean
        uTurnButtonState: Boolean
        lineABButtonState: Boolean
        curveLineButtonState: Boolean
        hydraulicLiftButtonState: Boolean
        headlandButtonState: Boolean
        skipRowComboBoxState: Int
        distanceNavigationError: Int
        vehicleSetSteerAngel: Float
        vehicleActualSteerAngel: Float
        isBoundaryOn: Boolean
        isUTurnTriggered: Boolean
        isOnField: Boolean
        isJobOn: Boolean
      }

      type DataFromAog{
        vehicle: Vehicle
        sections: [Section]
        dataInfo: DataInfo
        controlButtonsState: ControlButtonsState
      }

      
      input VehicleInput{
        heading: Float!
        lat: Float!
        lon: Float!
     }

     input PointInput{
       lat: Float!
       lon: Float!
     }

     input SectionInput{
       pointLeft: PointInput!
       pointRight: PointInput!
       sectionId: Int!
       sectionNumber: Int
       buttonState: String
       isSectionOn: Boolean
     }
     input DataInfoInput{
       timestamp: String
     }

     input ControlButtonsStateInput{
      buttonAutoState: String
      buttonManState: String
      autoSteerButtonState: Boolean
      uTurnButtonState: Boolean
      lineABButtonState: Boolean
      curveLineButtonState: Boolean
      hydraulicLiftButtonState: Boolean
      headlandButtonState: Boolean
      skipRowComboBoxState: Int
      distanceNavigationError: Int
      vehicleSetSteerAngel: Float
      vehicleActualSteerAngel: Float
      isBoundaryOn: Boolean
      isUTurnTriggered: Boolean
      isOnField: Boolean
      isJobOn: Boolean
    }

     input DataFromAogInput{
       vehicle: VehicleInput
       sections: [SectionInput]
       dataInfo: DataInfoInput
       controlButtonsState: ControlButtonsStateInput
     }
  
      type Query{
        dataFromAog: DataFromAog
      }

 
      type Mutation {
          postDataFromAog(dataFromAogInput: DataFromAogInput): ID!
          postCallAction(actionName: String!, actionParams: String, messageType: String): ID!
      }
  
      type Subscription{
        dataFromAog: DataFromAog
      }
  `;

exports.typeDefs = typeDefs;
