package multistage_delete

import (
	"database/sql"
	"engine_app/core"
	"engine_app/database/model"
	"engine_app/filters"
	"engine_app/providers"
	"strings"
)

// Delete all objects connected with project
func DeleteProjectConnected(deleteIntent filters.IdsIntent, db *sql.DB, provider *providers.Provider) error {

	if len(deleteIntent.Ids) == 0 {
		return nil
	}
	var projectConfigs []model.ProjectConfig
	err := provider.QueryListStatement(&projectConfigs, filters.FilterBy{
		Field: "project_id",
		Args:  core.IntsToStrings(deleteIntent.Ids),
	})
	if len(projectConfigs) > 0 {
		projectConfigIds := make([]int, len(projectConfigs))
		for i := range projectConfigs {
			projectConfigIds[i] = int(projectConfigs[i].ID)
		}

		// delete project config data
		ids := core.IntsToString(projectConfigIds)
		query := "delete from project_config_data where project_config_id in ($1)"
		query = strings.Replace(query, "$1", ids, -1)
		_, err = db.Exec(query)

		ids = core.IntsToString(deleteIntent.Ids)
		query = "delete from time_project_data where project_id in ($1)"
		query = strings.Replace(query, "$1", ids, -1)
		_, err = db.Exec(query)

		ids = core.IntsToString(projectConfigIds)
		query = "delete from project_configs where id in ($1)"
		query = strings.Replace(query, "$1", ids, -1)
		_, err = db.Exec(query)

		ids = core.IntsToString(deleteIntent.Ids)
		query = "delete from projects where id in ($1)"
		query = strings.Replace(query, "$1", ids, -1)
		_, err = db.Exec(query)
		if err != nil {
			return err
		}
	}

	return nil
}
