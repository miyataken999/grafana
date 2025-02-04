package ualert

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/grafana/grafana/pkg/util"
)

type alertRule struct {
	OrgId           int64
	Title           string
	Condition       string
	Data            []alertQuery
	IntervalSeconds int64
	Uid             string
	NamespaceUid    string
	RuleGroup       string
	NoDataState     string
	ExecErrState    string
	For             duration
	Updated         time.Time
	Annotations     map[string]string
	// Labels map[string]string (Labels are not Created in the migration)
}

func getMigrationInfo(da dashAlert) string {
	return fmt.Sprintf(`{"dashboardUid": "%v", "panelId": %v, "alertId": %v}`, da.DashboardUID, da.PanelId, da.Id)
}

func (m *migration) makeAlertRule(cond condition, da dashAlert, folderUID string) (*alertRule, error) {
	migAnnotation := getMigrationInfo(da)

	annotations := da.ParsedSettings.AlertRuleTags
	if annotations == nil {
		annotations = make(map[string]string, 1)
	}
	annotations["__migration__info__"] = migAnnotation

	ar := &alertRule{
		OrgId:           da.OrgId,
		Title:           da.Name, // TODO: Make sure all names are unique, make new name on constraint insert error.
		Condition:       cond.Condition,
		Data:            cond.Data,
		IntervalSeconds: ruleAdjustInterval(da.Frequency),
		NamespaceUid:    folderUID, // Folder already created, comes from env var.
		RuleGroup:       da.Name,
		For:             duration(da.For),
		Updated:         time.Now().UTC(),
		Annotations:     annotations,
	}
	var err error
	ar.Uid, err = m.generateAlertRuleUID(ar.OrgId)
	if err != nil {
		return nil, err
	}

	ar.NoDataState, err = transNoData(da.ParsedSettings.NoDataState)
	if err != nil {
		return nil, err
	}

	ar.ExecErrState, err = transExecErr(da.ParsedSettings.ExecutionErrorState)
	if err != nil {
		return nil, err
	}

	return ar, nil
}

func (m *migration) generateAlertRuleUID(orgId int64) (string, error) {
	for i := 0; i < 20; i++ {
		uid := util.GenerateShortUID()

		exists, err := m.sess.Where("org_id=? AND uid=?", orgId, uid).Get(&alertRule{})
		if err != nil {
			return "", err
		}

		if !exists {
			return uid, nil
		}
	}

	return "", fmt.Errorf("could not generate unique uid for alert rule")
}

// TODO: Do I need to create an initial alertRuleVersion as well?

type alertQuery struct {
	// RefID is the unique identifier of the query, set by the frontend call.
	RefID string `json:"refId"`

	// QueryType is an optional identifier for the type of query.
	// It can be used to distinguish different types of queries.
	QueryType string `json:"queryType"`

	// RelativeTimeRange is the relative Start and End of the query as sent by the frontend.
	RelativeTimeRange relativeTimeRange `json:"relativeTimeRange"`

	DatasourceUID string `json:"datasourceUid"`

	// JSON is the raw JSON query and includes the above properties as well as custom properties.
	Model json.RawMessage `json:"model"`
}

// RelativeTimeRange is the per query start and end time
// for requests.
type relativeTimeRange struct {
	From duration `json:"from"`
	To   duration `json:"to"`
}

// duration is a type used for marshalling durations.
type duration time.Duration

func (d duration) String() string {
	return time.Duration(d).String()
}

func (d duration) MarshalJSON() ([]byte, error) {
	return json.Marshal(time.Duration(d).Seconds())
}

func (d *duration) UnmarshalJSON(b []byte) error {
	var v interface{}
	if err := json.Unmarshal(b, &v); err != nil {
		return err
	}
	switch value := v.(type) {
	case float64:
		*d = duration(time.Duration(value) * time.Second)
		return nil
	default:
		return fmt.Errorf("invalid duration %v", v)
	}
}

func ruleAdjustInterval(freq int64) int64 {
	// 10 corresponds to the SchedulerCfg, but TODO not worrying about fetching for now.
	var baseFreq int64 = 10
	if freq <= baseFreq {
		return 10
	}
	return freq - (freq % baseFreq)
}

func transNoData(s string) (string, error) {
	switch s {
	case "ok":
		return "OK", nil // values from ngalert/models/rule
	case "", "no_data":
		return "NoData", nil
	case "alerting":
		return "Alerting", nil
	case "keep_state":
		return "KeepLastState", nil
	}
	return "", fmt.Errorf("unrecognized No Data setting %v", s)
}

func transExecErr(s string) (string, error) {
	switch s {
	case "", "alerting":
		return "Alerting", nil
	case "KeepLastState":
		return "KeepLastState", nil
	}
	return "", fmt.Errorf("unrecognized Execution Error setting %v", s)
}
