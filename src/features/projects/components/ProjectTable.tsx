'use client';
import Link from 'next/link';
import type { Project, ProjectSortField, ProjectSort } from '@/types/project';
import { ProjectStatusBadge } from './ProjectStatusBadge';
import { PriorityBadge, HealthBadge } from './ProjectBadges';
import { ProgressBar } from './ProgressBar';

interface Props {
  projects: Project[];
  sort: ProjectSort;
  onSort: (field: ProjectSortField) => void;
}

function Th({
  label,
  field,
  sort,
  onSort,
}: {
  label: string;
  field: ProjectSortField;
  sort: ProjectSort;
  onSort: (f: ProjectSortField) => void;
}) {
  const active = sort.field === field;
  return (
    <th
      className={`prj-table__th${active ? ' prj-table__th--active' : ''}`}
      onClick={() => onSort(field)}
    >
      {label}
      <span className="prj-table__sort-icon">
        {active ? (sort.direction === 'asc' ? '↑' : '↓') : '↕'}
      </span>
    </th>
  );
}

export function ProjectTable({ projects, sort, onSort }: Props) {
  if (projects.length === 0) {
    return (
      <div className="prj-table__empty">
        No projects match your filters.
      </div>
    );
  }

  return (
    <div className="prj-table-wrap">
      <table className="prj-table">
        <thead>
          <tr>
            <Th label="Project" field="name" sort={sort} onSort={onSort} />
            <Th label="Status" field="status" sort={sort} onSort={onSort} />
            <Th label="Priority" field="priority" sort={sort} onSort={onSort} />
            <th className="prj-table__th">Health</th>
            <Th label="Progress" field="completionPct" sort={sort} onSort={onSort} />
            <Th label="Start" field="startDate" sort={sort} onSort={onSort} />
            <Th label="Due" field="targetEndDate" sort={sort} onSort={onSort} />
            <th className="prj-table__th">Team</th>
            <th className="prj-table__th prj-table__th--action" />
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => (
            <tr key={p.id} className="prj-table__row">
              <td className="prj-table__td">
                <Link href={`/projects/${p.id}`} className="prj-table__name-link">
                  <span className="prj-table__code">{p.projectCode}</span>
                  <span className="prj-table__name">{p.name}</span>
                </Link>
              </td>
              <td className="prj-table__td">
                <ProjectStatusBadge status={p.status} size="sm" />
              </td>
              <td className="prj-table__td">
                <PriorityBadge priority={p.priority} size="sm" />
              </td>
              <td className="prj-table__td">
                <HealthBadge health={p.health} size="sm" />
              </td>
              <td className="prj-table__td prj-table__td--progress">
                <ProgressBar value={p.completionPct} size="sm" showLabel />
              </td>
              <td className="prj-table__td prj-table__td--date">
                {new Date(p.startDate).toLocaleDateString('en-GB', {
                  day: 'numeric', month: 'short', year: '2-digit',
                })}
              </td>
              <td className="prj-table__td prj-table__td--date">
                {new Date(p.targetEndDate).toLocaleDateString('en-GB', {
                  day: 'numeric', month: 'short', year: '2-digit',
                })}
              </td>
              <td className="prj-table__td">
                <span className="prj-table__members">
                  {p.members.length}
                </span>
              </td>
              <td className="prj-table__td prj-table__td--action">
                <Link href={`/projects/${p.id}`} className="prj-table__view-btn">
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
