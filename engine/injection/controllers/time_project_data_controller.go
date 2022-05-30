package controllers

import (
	"encoding/json"
	"engine_app/database/model"
	"engine_app/filters"
	"net/http"
)

type TimeProjectDataController struct {
	AppInjection *AppInjection
}

func (tpd *TimeProjectDataController) GetTimeProjectDataControllerFiltered(
	writer http.ResponseWriter,
	request *http.Request) {

	var timeProjectDatas []model.TimeProjectData
	field, _ := request.URL.Query()["field"]
	args, _ := request.URL.Query()["val"]
	filter := filters.FilterBy{
		Field: field[0],
		Args:  args,
	}

	if err := tpd.AppInjection.Provider.QueryListStatement(&timeProjectDatas, filter); err != nil {
		writer.WriteHeader(http.StatusBadRequest)
		writer.Write([]byte(err.Error()))
	} else {
		writer.WriteHeader(http.StatusOK)
		json.NewEncoder(writer).Encode(timeProjectDatas)
	}
}

func (tpd *TimeProjectDataController) DeleteTimeProjectDataController(
	writer http.ResponseWriter,
	request *http.Request) {
	var timeDataProjectData model.TimeProjectData
	decodeError := Decode(request, &timeDataProjectData)
	if decodeError != nil {
		writer.WriteHeader(http.StatusForbidden)
		writer.Write([]byte(decodeError.Error()))
		return
	}
	res := tpd.AppInjection.Provider.Db.Delete(&timeDataProjectData)

	if res.Error != nil {
		writer.WriteHeader(http.StatusBadRequest)
		writer.Write([]byte(res.Error.Error()))
	} else {
		writer.WriteHeader(http.StatusOK)
	}
}
