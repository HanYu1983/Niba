namespace HelloWorld

module Type = 
    type GoogleMeta = {
        resourceName: string option
        isVideo: bool option
    }

    type DesiredState =
        | On
        | Off
        | NotSet

    type Item = {
        id: string option
        name: string option
        area: string option
        googleMeta: GoogleMeta option
        desiredState: DesiredState option
    }


    type SystemInput = {
        clientId: string option
        startDate: string option
        endDate: string option
        items: (Item list) option
    }

    
    type SystemOutput = SystemInput

    // function type
    type SystemProcess = SystemInput -> SystemOutput

    