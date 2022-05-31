package controllers

import (
	"bytes"
	"encoding/json"
	"engine_app/database/model"
	"engine_app/filters"
	"fmt"
	"github.com/spf13/viper"
	"io"
	"log"
	"net/http"
	"strconv"
	"strings"
)

type DataFileController struct {
	*BaseCrudController
}

func (c *DataFileController) AddDataFile(
	writer http.ResponseWriter,
	request *http.Request) {
	dataFile := model.Data{}

	file, header, _ := request.FormFile("File")
	if file == nil {
		writer.Write([]byte("No file"))
		writer.WriteHeader(http.StatusBadRequest)
		return
	}
	dataFile.Label = request.MultipartForm.Value["Label"][0]

	if c.AppInjection.UseAuth {
		signingKey := []byte(viper.GetString("auth.signing_key"))
		reqToken := request.Header.Get("Authorization")
		splitToken := strings.Split(reqToken, "Bearer ")
		if len(splitToken) == 1 {
			writer.WriteHeader(http.StatusForbidden)
			return
		}
		reqToken = splitToken[1]
		userNameFromToken, _ := ParseToken(reqToken, signingKey)
		if dataFile.Author == "" {
			dataFile.Author = userNameFromToken
		}
		if userNameFromToken == "" {
			writer.Write([]byte("No user info"))
			writer.WriteHeader(http.StatusForbidden)
			return
		}
	}

	dataFile.FileName = header.Filename
	var buf bytes.Buffer
	_, err := io.Copy(&buf, file)
	if err != nil {
		log.Fatal(err)
	}
	dataFile.File = buf.Bytes()

	c.Add(&dataFile, request, writer)
}

func (c *DataFileController) DeleteDataFile(
	writer http.ResponseWriter,
	request *http.Request) {

	var deleteIntent filters.IdsIntent
	decodeError := Decode(request, &deleteIntent)
	if decodeError != nil {
		writer.WriteHeader(http.StatusBadRequest)
		writer.Write([]byte(decodeError.Error()))
		return
	}
	str := strings.Trim(strings.Replace(fmt.Sprint(deleteIntent.Ids), " ", ",", -1), "[]")
	query := "delete from project_config_data where data_id in ($1)"
	query = strings.Replace(query, "$1", str, -1)
	_, err := c.AppInjection.Db.Exec(query)
	if err != nil {
		writer.WriteHeader(http.StatusBadRequest)
		writer.Write([]byte(err.Error()))
		return
	}

	var data model.Data
	c.Delete(&data, request, writer)
}

func (c *DataFileController) GetAllDataFile(
	writer http.ResponseWriter,
	request *http.Request) {
	var dataFile []model.Data
	c.GetAll(&dataFile, request, writer)
}

func (c *DataFileController) GetFilteredDataFile(
	writer http.ResponseWriter,
	request *http.Request) {
	var datafiles []model.Data
	c.GetFilteredBy(&datafiles, request, writer)
}

func (c *DataFileController) GetFilteredDataFileByProjectId(
	writer http.ResponseWriter,
	request *http.Request) {
	projectConfigId, _ := request.URL.Query()["project_config_id"]
	queryStatement := fmt.Sprintf("select * from project_config_data where %s = %s", "project_config_id", projectConfigId[0])
	rows, err := c.AppInjection.Db.Query(queryStatement)
	if err != nil {
		writer.WriteHeader(http.StatusBadRequest)
		writer.Write([]byte(err.Error()))
		return
	}
	defer rows.Close()
	var dataIds []string

	for rows.Next() {
		p := DataProject{}
		err := rows.Scan(&p.DataId, &p.ProjectConfigId)
		if err != nil {
			fmt.Println(err)
			continue
		}
		dataIds = append(dataIds, strconv.Itoa(p.DataId))
	}

	var dataFiles []model.Data
	var filter = filters.FilterBy{
		Field: "id",
		Args:  dataIds,
	}

	if err = c.AppInjection.Provider.QueryListStatement(&dataFiles, filter); err != nil {
		writer.WriteHeader(http.StatusBadRequest)
		writer.Write([]byte(err.Error()))
	} else {
		writer.WriteHeader(http.StatusOK)
		json.NewEncoder(writer).Encode(dataFiles)
	}
}

func (c *DataFileController) GetDataFileContent(
	writer http.ResponseWriter,
	request *http.Request) {
	ids, _ := request.URL.Query()["id"]
	id := ids[0]
	var data model.Data
	filter := filters.FilterBy{
		Field: "id",
		Args:  []string{id},
	}
	err := c.AppInjection.Provider.QueryListStatement(&data, filter)
	if err != nil {
		writer.WriteHeader(http.StatusBadRequest)
		writer.Write([]byte(err.Error()))
		return
	}
	str := string(data.File)
	writer.Write([]byte(str))
	writer.WriteHeader(http.StatusOK)
}
