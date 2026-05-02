"use client";
import { useEffect, useState } from "react";
import {
  Container, Typography, Box, Tabs, Tab, Chip,
  CircularProgress, Alert, FormControl, InputLabel,
  Select, MenuItem, Badge, Card, CardContent, Divider
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import StarIcon from "@mui/icons-material/Star";
import { fetchNotifications, getTopN, Notification } from "../lib/api";
import { Log } from "../lib/logger";

export default function Home() {
  const [tab, setTab] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [topN, setTopN] = useState(10);
  const [viewed, setViewed] = useState<Set<string>>(new Set());

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        await Log("frontend", "info", "page", "Fetching notifications on page load");
        const data = await fetchNotifications({ limit: 50 });
        setNotifications(data);
        await Log("frontend", "info", "page", `Fetched ${data.length} notifications successfully`);
      } catch (err) {
        setError("Failed to load notifications");
        await Log("frontend", "error", "page", "Failed to fetch notifications from API");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const markViewed = async (id: string) => {
    if (!viewed.has(id)) {
      setViewed(prev => new Set(prev).add(id));
      await Log("frontend", "info", "state", `Notification ${id} marked as viewed`);
    }
  };

  const filtered = filterType === "All"
    ? notifications
    : notifications.filter(n => n.Type === filterType);

  const priorityList = getTopN(notifications, topN);

  const typeColor: Record<string, "error" | "warning" | "info" | "default"> = {
    Placement: "error",
    Result: "warning",
    Event: "info",
  };

  const NotificationCard = ({ n }: { n: Notification }) => {
    const isNew = !viewed.has(n.ID);
    return (
      <Card
        onClick={() => markViewed(n.ID)}
        sx={{
          mb: 1.5,
          cursor: "pointer",
          border: isNew ? "2px solid #1976d2" : "1px solid #e0e0e0",
          backgroundColor: isNew ? "#e3f2fd" : "#fff",
          transition: "all 0.2s",
          "&:hover": { boxShadow: 3 },
        }}
      >
        <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {isNew && <Badge color="primary" variant="dot" />}
              <Chip
                label={n.Type}
                color={typeColor[n.Type] || "default"}
                size="small"
              />
              <Typography variant="body2" sx={{ fontWeight: isNew ? 700 : 400 }}>
                {n.Message}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              {new Date(n.Timestamp).toLocaleString()}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <NotificationsIcon color="primary" fontSize="large" />
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Campus Notifications
        </Typography>
      </Box>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab icon={<NotificationsIcon />} label="All Notifications" />
        <Tab icon={<StarIcon />} label="Priority Inbox" />
      </Tabs>

      <Divider sx={{ mb: 3 }} />

      {loading && <Box sx={{ display: "flex", justifyContent: "center" }}><CircularProgress /></Box>}
      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && tab === 0 && (
        <Box>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Filter by Type</InputLabel>
              <Select
                value={filterType}
                label="Filter by Type"
                onChange={(e) => {
                  setFilterType(e.target.value);
                  Log("frontend", "info", "state", `Filter changed to ${e.target.value}`);
                }}
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Placement">Placement</MenuItem>
                <MenuItem value="Result">Result</MenuItem>
                <MenuItem value="Event">Event</MenuItem>
              </Select>
            </FormControl>
            <Typography variant="body2" color="text.secondary" sx={{ alignSelf: "center" }}>
              {filtered.length} notifications
            </Typography>
          </Box>
          {filtered.map(n => <NotificationCard key={n.ID} n={n} />)}
        </Box>
      )}

      {!loading && !error && tab === 1 && (
        <Box>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Show Top N</InputLabel>
              <Select
                value={topN}
                label="Show Top N"
                onChange={(e) => {
                  setTopN(Number(e.target.value));
                  Log("frontend", "info", "state", `Top N changed to ${e.target.value}`);
                }}
              >
                {[5, 10, 15, 20].map(n => (
                  <MenuItem key={n} value={n}>Top {n}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography variant="body2" color="text.secondary" sx={{ alignSelf: "center" }}>
              Sorted by: Placement &gt; Result &gt; Event + Recency
            </Typography>
          </Box>
          {priorityList.map(n => <NotificationCard key={n.ID} n={n} />)}
        </Box>
      )}
    </Container>
  );
}