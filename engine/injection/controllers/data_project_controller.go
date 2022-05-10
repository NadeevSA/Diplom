package controllers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
)

type DataProjectController struct {
	Db *sql.DB
}

type DataProject struct {
	DataId          int `db:"data_id"`
	ProjectConfigId int `db:"project_config_id"`
}

func (c *DataProjectController) AddDataProject(
	writer http.ResponseWriter,
	request *http.Request) {
	var intent DataProject
	Decode(request, &intent, writer)

	_, err := c.Db.Exec("insert into project_config_data (data_id, project_config_id)values ($1, $2)", intent.DataId, intent.ProjectConfigId)
	if err != nil {
		writer.WriteHeader(http.StatusBadRequest)
		writer.Write([]byte(err.Error()))
	} else {
		writer.WriteHeader(http.StatusOK)
	}
}

func (c *DataProjectController) GetDataProject(
	writer http.ResponseWriter,
	request *http.Request) {
	field, _ := request.URL.Query()["field"]
	args, _ := request.URL.Query()["val"]

	queryStatement := fmt.Sprintf("select * from project_config_data where %s = %s", field[0], args[0])
	rows, err := c.Db.Query(queryStatement)
	if err != nil {
		panic(err)
	}
	defer rows.Close()
	var dataProject []DataProject

	for rows.Next() {
		p := DataProject{}
		err := rows.Scan(&p.DataId, &p.ProjectConfigId)
		if err != nil {
			fmt.Println(err)
			continue
		}
		dataProject = append(dataProject, p)
	}
	json.NewEncoder(writer).Encode(dataProject)
}

func (c *DataProjectController) DeleteDataProject(
	writer http.ResponseWriter,
	request *http.Request) {
	var intent DataProject
	Decode(request, &intent, writer)

	_, err := c.Db.Exec("delete from project_config_data where (data_id = $1 AND project_config_id = $2)", intent.DataId, intent.ProjectConfigId)
	if err != nil {
		writer.WriteHeader(http.StatusBadRequest)
		writer.Write([]byte(err.Error()))
	} else {
		writer.WriteHeader(http.StatusOK)
	}
}
