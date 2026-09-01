import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  BookOpen,
  Bot,
  Boxes,
  CheckCircle2,
  ChevronRight,
  CircleGauge,
  Clock3,
  LayoutDashboard,
  MapPin,
  Radio,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Workflow,
  Wrench,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import {
  fetchEquipment,
  type ApiEquipment,
} from "./services/fieldflowApi";
import "./App.css";

type EquipmentStatus =
  | "Operational"
  | "Warning"
  | "Critical"
  | "Maintenance"
  | "Offline";

type Equipment = {
  id: string;
  model: string;
  category: string;
  location: string;
  status: EquipmentStatus;
  health: number;
};

type MetricCardProps = {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  tone: "green" | "amber" | "red" | "blue";
};

const initialEquipment: Equipment[] = [
  {
    id: "FF-BC-1007",
    model: "BC-150 Brush Chipper",
    category: "Tree Care",
    location: "Des Moines, IA",
    status: "Operational",
    health: 96,
  },
  {
    id: "FF-DD-2041",
    model: "DD-40 Directional Drill",
    category: "Underground",
    location: "Denver, CO",
    status: "Warning",
    health: 78,
  },
  {
    id: "FF-TR-3018",
    model: "TR-95 Trencher",
    category: "Utility Installation",
    location: "Omaha, NE",
    status: "Critical",
    health: 52,
  },
  {
    id: "FF-RC-4025",
    model: "RC-60 Recycling System",
    category: "Environmental",
    location: "Austin, TX",
    status: "Maintenance",
    health: 85,
  },
  {
    id: "FF-SG-5032",
    model: "SG-80 Stump Grinder",
    category: "Tree Care",
    location: "Kansas City, MO",
    status: "Offline",
    health: 61,
  },
];

function mapApiEquipment(item: ApiEquipment): Equipment {
  const formattedStatus =
    item.status.charAt(0).toUpperCase() + item.status.slice(1);

  return {
    id: item.equipment_id,
    model: item.model,
    category: item.category,
    location: item.location,
    status: formattedStatus as EquipmentStatus,
    health: item.health_score,
  };
}

const serviceActivity = [
  { day: "Mon", cases: 14, resolved: 11 },
  { day: "Tue", cases: 18, resolved: 14 },
  { day: "Wed", cases: 15, resolved: 15 },
  { day: "Thu", cases: 22, resolved: 17 },
  { day: "Fri", cases: 19, resolved: 18 },
  { day: "Sat", cases: 11, resolved: 10 },
  { day: "Sun", cases: 16, resolved: 13 },
];

const serviceCases = [
  {
    id: "CASE-1047",
    priority: "Critical",
    title: "Hydraulic pressure below threshold",
    asset: "TR-95 Trencher · FF-TR-3018",
    time: "12 min ago",
  },
  {
    id: "CASE-1046",
    priority: "High",
    title: "Telemetry connection degraded",
    asset: "DD-40 Drill · FF-DD-2041",
    time: "34 min ago",
  },
  {
    id: "CASE-1043",
    priority: "Medium",
    title: "Preventive maintenance approaching",
    asset: "RC-60 System · FF-RC-4025",
    time: "2 hr ago",
  },
];

const navigation = [
  {
    title: "Workspace",
    items: [
      { label: "Overview", icon: LayoutDashboard, active: true },
      { label: "Equipment", icon: Boxes },
      { label: "Service Cases", icon: Wrench, badge: "12" },
      { label: "AI Assistant", icon: Bot },
      { label: "Automations", icon: Workflow },
      { label: "Analytics", icon: BarChart3 },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Knowledge Base", icon: BookOpen },
      { label: "AI Governance", icon: ShieldCheck },
      { label: "Settings", icon: Settings2 },
    ],
  },
];

function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
  tone,
}: MetricCardProps) {
  return (
    <article className="metric-card">
      <div className={`metric-icon ${tone}`}>
        <Icon size={20} strokeWidth={2} />
      </div>

      <div className="metric-copy">
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{detail}</small>
      </div>
    </article>
  );
}

function StatusBadge({ status }: { status: EquipmentStatus }) {
  return (
    <span className={`status-badge ${status.toLowerCase()}`}>
      <span className="status-dot" />
      {status}
    </span>
  );
}

function App() {
  const [equipment, setEquipment] =
    useState<Equipment[]>(initialEquipment);
  const [apiStatus, setApiStatus] = useState<
    "connecting" | "connected" | "error"
  >("connecting");
  const [selectedEquipmentId, setSelectedEquipmentId] =
    useState("FF-TR-3018");

  useEffect(() => {
    async function loadEquipment() {
      try {
        const records = await fetchEquipment();

        if (records.length === 0) {
          throw new Error("The equipment API returned no records.");
        }

        setEquipment(records.map(mapApiEquipment));
        setApiStatus("connected");
      } catch (error) {
        console.error("Unable to load equipment:", error);
        setApiStatus("error");
      }
    }

    void loadEquipment();
  }, []);

  const selectedEquipment =
    equipment.find((item) => item.id === selectedEquipmentId) ??
    equipment[0];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <Workflow size={21} strokeWidth={2.4} />
          </div>
          <div>
            <strong>FieldFlow</strong>
            <span>AI</span>
          </div>
        </div>

        <nav className="navigation" aria-label="Main navigation">
          {navigation.map((group) => (
            <div className="nav-group" key={group.title}>
              <p>{group.title}</p>

              {group.items.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    className={`nav-item ${item.active ? "active" : ""}`}
                    key={item.label}
                    type="button"
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                    {item.badge && <small>{item.badge}</small>}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="system-card">
          <div className="system-card-icon">
            <Sparkles size={18} />
          </div>
          <div>
            <strong>Service Agent</strong>
            <span>
              <i />
              Online
            </span>
          </div>
          <ChevronRight size={17} />
        </div>

        <div className="user-card">
          <div className="avatar">ZS</div>
          <div>
            <strong>Zavhier Sanchez</strong>
            <span>Operations Admin</span>
          </div>
        </div>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div className="search">
            <Search size={18} />
            <input
              aria-label="Search equipment and service cases"
              placeholder="Search equipment, cases, or dealers"
            />
            <kbd>⌘ K</kbd>
          </div>

          <div className="topbar-actions">
            <div className="environment">
              <span />
              Production
            </div>
            <button
              aria-label="Notifications"
              className="icon-button"
              type="button"
            >
              <Bell size={19} />
              <i />
            </button>
          </div>
        </header>

        <div className="dashboard">
          <section className="page-heading">
            <div>
              <p>OPERATIONS CENTER / FIRST SHIFT</p>
              <h1>Equipment operations</h1>
              <span>
                Live service health across the connected equipment fleet.
              </span>
            </div>

            <div className={`live-update ${apiStatus}`}>
              <Radio size={17} />
              <div>
                <strong>
                  {apiStatus === "connected"
                    ? "API connected"
                    : apiStatus === "error"
                      ? "API unavailable"
                      : "Connecting to API"}
                </strong>
                <span>
                  {apiStatus === "connected"
                    ? "Equipment records synchronized"
                    : apiStatus === "error"
                      ? "Displaying cached equipment"
                      : "Loading equipment records"}
                </span>
              </div>
            </div>
          </section>

          <section className="metrics-grid">
            <MetricCard
              label="Fleet health"
              value="94.2%"
              detail="+2.1% this week"
              icon={CircleGauge}
              tone="green"
            />
            <MetricCard
              label="Active assets"
              value="42"
              detail="37 reporting online"
              icon={Activity}
              tone="blue"
            />
            <MetricCard
              label="Open cases"
              value="12"
              detail="3 require attention"
              icon={AlertTriangle}
              tone="red"
            />
            <MetricCard
              label="Automation health"
              value="98.7%"
              detail="6 workflows active"
              icon={Workflow}
              tone="amber"
            />
          </section>

          <section className="primary-grid">
            <article className="panel fleet-panel">
              <div className="panel-heading">
                <div>
                  <p>FLEET MONITOR</p>
                  <h2>Equipment health</h2>
                </div>

                <button type="button">
                  View all equipment
                  <ChevronRight size={16} />
                </button>
              </div>

              <div className="equipment-table">
                <div className="equipment-header">
                  <span>Equipment</span>
                  <span>Location</span>
                  <span>Status</span>
                  <span>Health</span>
                </div>

                {equipment.map((item) => (
                  <button
                    className={`equipment-row ${
                      selectedEquipmentId === item.id ? "selected" : ""
                    }`}
                    key={item.id}
                    onClick={() => setSelectedEquipmentId(item.id)}
                    type="button"
                  >
                    <span className="equipment-name">
                      <span className="machine-icon">
                        <Boxes size={18} />
                      </span>
                      <span>
                        <strong>{item.model}</strong>
                        <small>{item.id}</small>
                      </span>
                    </span>

                    <span className="location">
                      <MapPin size={15} />
                      {item.location}
                    </span>

                    <StatusBadge status={item.status} />

                    <span className="health-score">
                      <span>
                        <i style={{ width: `${item.health}%` }} />
                      </span>
                      <strong>{item.health}%</strong>
                    </span>
                  </button>
                ))}
              </div>

              <div className="selected-asset">
                <span className="pulse-ring">
                  <Radio size={16} />
                </span>
                <div>
                  <span>Selected asset</span>
                  <strong>{selectedEquipment.model}</strong>
                </div>
                <p>
                  {selectedEquipment.category} · {selectedEquipment.id}
                </p>
                <button type="button">
                  Open telemetry
                  <ChevronRight size={15} />
                </button>
              </div>
            </article>

            <article className="panel case-panel">
              <div className="panel-heading">
                <div>
                  <p>SERVICE QUEUE</p>
                  <h2>Priority cases</h2>
                </div>
                <span className="case-count">12 open</span>
              </div>

              <div className="case-list">
                {serviceCases.map((serviceCase) => (
                  <button
                    className="case-item"
                    key={serviceCase.id}
                    type="button"
                  >
                    <span
                      className={`priority-line ${serviceCase.priority.toLowerCase()}`}
                    />
                    <span className="case-content">
                      <span className="case-meta">
                        <strong>{serviceCase.id}</strong>
                        <span>{serviceCase.priority}</span>
                      </span>
                      <b>{serviceCase.title}</b>
                      <small>{serviceCase.asset}</small>
                      <span className="case-time">
                        <Clock3 size={14} />
                        {serviceCase.time}
                      </span>
                    </span>
                    <ChevronRight size={17} />
                  </button>
                ))}
              </div>

              <button className="agent-action" type="button">
                <span>
                  <Bot size={19} />
                </span>
                <div>
                  <strong>Ask Service Agent</strong>
                  <small>Investigate an equipment issue</small>
                </div>
                <ChevronRight size={17} />
              </button>
            </article>
          </section>

          <section className="secondary-grid">
            <article className="panel activity-panel">
              <div className="panel-heading">
                <div>
                  <p>LAST 7 DAYS</p>
                  <h2>Service activity</h2>
                </div>
                <div className="chart-legend">
                  <span>
                    <i className="cases" />
                    Opened
                  </span>
                  <span>
                    <i className="resolved" />
                    Resolved
                  </span>
                </div>
              </div>

              <div className="chart">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={serviceActivity}>
                    <defs>
                      <linearGradient
                        id="caseGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#e7a92f"
                          stopOpacity={0.28}
                        />
                        <stop
                          offset="95%"
                          stopColor="#e7a92f"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>

                    <CartesianGrid
                      stroke="#e7e9e4"
                      strokeDasharray="4 4"
                      vertical={false}
                    />

                    <XAxis
                      axisLine={false}
                      dataKey="day"
                      tick={{ fill: "#81867e", fontSize: 12 }}
                      tickLine={false}
                    />

                    <Tooltip
                      contentStyle={{
                        background: "#171a18",
                        border: "none",
                        borderRadius: "10px",
                        color: "#ffffff",
                      }}
                    />

                    <Area
                      dataKey="cases"
                      fill="url(#caseGradient)"
                      stroke="#d6971f"
                      strokeWidth={2.5}
                      type="monotone"
                    />

                    <Area
                      dataKey="resolved"
                      fill="transparent"
                      stroke="#27785d"
                      strokeDasharray="5 4"
                      strokeWidth={2}
                      type="monotone"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </article>

            <article className="panel automation-panel">
              <div className="panel-heading">
                <div>
                  <p>WORKFLOW STATUS</p>
                  <h2>Automation health</h2>
                </div>

                <span className="healthy-label">
                  <CheckCircle2 size={15} />
                  Healthy
                </span>
              </div>

              <div className="automation-score">
                <div>
                  <strong>98.7%</strong>
                  <span>Successful runs</span>
                </div>
                <CircleGauge size={55} strokeWidth={1.5} />
              </div>

              <div className="automation-list">
                <div>
                  <span>Critical case routing</span>
                  <strong>Passing</strong>
                </div>
                <div>
                  <span>Dealer assignment</span>
                  <strong>Passing</strong>
                </div>
                <div>
                  <span>Telemetry synchronization</span>
                  <strong>Passing</strong>
                </div>
              </div>
            </article>
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;