package multistage_delete

import (
	"database/sql"
	"engine_app/filters"
	"fmt"
	"strings"
)

func DeleteData(deleteIntent filters.IdsIntent, db *sql.DB) error {
	str := strings.Trim(strings.Replace(fmt.Sprint(deleteIntent.Ids), " ", ",", -1), "[]")
	query := "delete from project_config_data where data_id in ($1)"
	query = strings.Replace(query, "$1", str, -1)
	_, err := db.Exec(query)
	if err != nil {
		return err
	}

	query = "delete from time_project_data where data_id in ($1)"
	query = strings.Replace(query, "$1", str, -1)
	_, err = db.Exec(query)
	if err != nil {
		return err
	}

	query = "delete from data where id in ($1)"
	query = strings.Replace(query, "$1", str, -1)
	_, err = db.Exec(query)
	if err != nil {
		return err
	}
	return nil
}
