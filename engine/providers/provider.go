package providers

import (
	"engine_app/filters"
	"fmt"
	"gorm.io/gorm"
)

type Provider struct {
	Db *gorm.DB
}

func (p *Provider) QueryListStatement(obj interface{}, filter filters.FilterBy) error {
	var str = fmt.Sprintf("%s in ?", filter.Field)
	err := p.Db.Where(str, filter.Args).Find(obj).Error
	return err
}

func (p *Provider) QueryListStatementAll(obj interface{}) error {
	err := p.Db.Find(obj).Error
	return err
}

func (p *Provider) AddStatement(obj interface{}) error {
	res := p.Db.Create(obj)
	return res.Error
}

func (p *Provider) UpdateStatement(obj interface{}) error {
	res := p.Db.Save(obj)
	return res.Error
}

func (p *Provider) DeleteStatement(obj interface{}, ids []int) error {
	res := p.Db.Delete(obj, ids)
	return res.Error
}
