// TODO: THIS WAS AI TRANSLATED FROM MY TASKGRABBER.JS FILE
//
//	IN THE OLD DESKTOP BLOCKER. NOT TESTED
package main

import (
	"bytes"
	"encoding/csv"
	"errors"
	"fmt"
	"os/exec"
	"path/filepath"
	"runtime"
	"strconv"
	"strings"
	"sync"
)

const TenMegabytes = 10 * 1000 * 1000

type Task struct {
	PID     int
	Name    string
	Program string
	CPU     float64
}

func (t *Task) Platform() string {
	return runtime.GOOS
}
func (t *Task) SetName(name string)       { t.Name = name }
func (t *Task) SetProgram(program string) { t.Program = program }
func (t *Task) SetCPU(cpu float64)        { t.CPU = cpu }

func (t *Task) IsFilled() bool {
	return t.PID != 0 && t.Name != "" && t.Program != "" && t.CPU >= 0
}

type Tasky struct{}

func New() *Tasky {
	return &Tasky{}
}

func (t *Tasky) GetWindowsTasks(callback func(Task)) ([]Task, error) {
	if runtime.GOOS != "windows" {
		return nil, errors.New("windows only")
	}
	if callback == nil {
		callback = func(Task) {}
	}

	cmd := exec.Command("cmd", "/C", "@chcp65001 >nul & tasklist /v /nh /fo csv")
	out, err := cmd.Output()
	if err != nil {
		return nil, err
	}

	stdout := string(out)
	if strings.HasPrefix(stdout, "INFO:") {
		return []Task{}, nil
	}

	r := csv.NewReader(strings.NewReader(stdout))
	r.FieldsPerRecord = -1
	rows, err := r.ReadAll()
	if err != nil {
		return nil, err
	}
	/*
		tasklist /fo csv columns:
		0 imageName,
		1 pid,
		2 sessionName,
		3 sessionNumber,
		4 memUsage,
		5 status,
		6 username,
		7 cpuTime,
		8 windowTitle
	*/
	tasks := make([]Task, 0, len(rows))

	for _, row := range rows {
		if len(row) < 9 {
			continue
		}
		pid, _ := strconv.Atoi(strings.TrimSpace(row[1]))
		cpuTime := parseCPUTimestampSeconds(strings.TrimSpace(row[7]))

		task := Task{
			PID:     pid,
			Name:    strings.TrimSpace(row[8]),
			Program: strings.TrimSpace(row[0]),
			CPU:     cpuTime,
		}
		callback(task)
		tasks = append(tasks, task)
	}

	return tasks, nil
}

const (
	psUnixFlagsAll     = "awwxo"
	psUnixFlagsDefault = "wwxo"
)

func (t *Tasky) GetUnixTasks(all bool, callback func(Task)) ([]Task, error) {
	if callback == nil {
		callback = func(Task) {}
	}

	headers := []string{"comm", "args", "%cpu"}
	flags := psUnixFlagsAll
	if !all {
		flags = psUnixFlagsDefault
	}

	type state struct {
		task    Task
		emitted bool
	}

	ret := map[int]*state{}
	tasks := make([]Task, 0, 256)

	var (
		mu  sync.Mutex
		wg  sync.WaitGroup
		err error
	)
	setErr := func(e error) {
		mu.Lock()
		defer mu.Unlock()
		if err == nil {
			err = e
		}
	}

	for _, col := range headers {
		wg.Add(1)
		go func(cmdCol string) {
			defer wg.Done()

			ps := exec.Command("ps", flags, fmt.Sprintf("pid,%s", cmdCol))
			var buf bytes.Buffer
			ps.Stdout = &buf
			if e := ps.Run(); e != nil {
				setErr(e)
				return
			}
			lines := strings.Split(strings.TrimSpace(buf.String()), "\n")
			if len(lines) <= 1 {
				return
			}

			for _, line := range lines[1:] {
				line = strings.TrimSpace(line)
				if line == "" {
					continue
				}

				pidStr, value, ok := splitPIDValue(line)
				if !ok {
					continue
				}

				pid, e := strconv.Atoi(pidStr)
				if e != nil || pid == 0 {
					continue
				}

				mu.Lock()
				st, exists := ret[pid]
				if !exists {
					st = &state{task: Task{PID: pid, CPU: -1}}
					ret[pid] = st
				}

				switch cmdCol {
				case "comm":
					st.task.SetName(filepath.Base(value))
				case "args":
					st.task.SetProgram(value)
				case "%cpu":
					f, _ := strconv.ParseFloat(value, 64)
					st.task.SetCPU(f)
				default:
					mu.Unlock()
					setErr(fmt.Errorf("wrong cmd %s", cmdCol))
					return
				}

				if st.task.IsFilled() && !st.emitted {
					st.emitted = true
					taskCopy := st.task
					tasks = append(tasks, taskCopy)
					mu.Unlock()
					callback(taskCopy)
					continue
				}
				mu.Unlock()
			}
		}(col)
	}

	wg.Wait()
	if err != nil {
		return nil, err
	}
	return tasks, nil
}

func splitPIDValue(line string) (pid string, value string, ok bool) {
	i := 0
	for i < len(line) && line[i] != ' ' && line[i] != '\t' {
		i++
	}
	if i == 0 {
		return "", "", false
	}
	pid = line[:i]
	value = strings.TrimSpace(line[i:])
	return pid, value, true
}

// Converts tasklist cpu time like HH:MM:SS or H:MM:SS to seconds.
func parseCPUTimestampSeconds(s string) float64 {
	parts := strings.Split(strings.TrimSpace(s), ":")
	if len(parts) != 3 {
		return 0
	}
	h, _ := strconv.Atoi(parts[0])
	m, _ := strconv.Atoi(parts[1])
	sec, _ := strconv.Atoi(parts[2])
	return float64(h*3600 + m*60 + sec)
}
