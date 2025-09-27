// --- Admin Delete/Update Endpoints (DB-backed) ---

// Delete a shooter (player flagged as shooting)
app.delete("/api/shooting/:id", async (req, res) => {
  try {
    if (!adminOK(req)) return bad(res, "Unauthorized", 401);
    const id = Number(req.params.id);
    const { rowCount } = await pool.query(
      `DELETE FROM players WHERE id=$1 AND shooting=true`,
      [id]
    );
    if (rowCount === 0) return notFound(res);
    ok(res, { message: "Shooter deleted" });
  } catch (e) {
    console.error(e);
    bad(res, "Delete failed", 500);
  }
});

// Delete a player (any tournament member)
app.delete("/api/players/:id", async (req, res) => {
  try {
    if (!adminOK(req)) return bad(res, "Unauthorized", 401);
    const id = Number(req.params.id);
    const { rowCount } = await pool.query(`DELETE FROM players WHERE id=$1`, [id]);
    if (rowCount === 0) return notFound(res);
    ok(res, { message: "Player deleted" });
  } catch (e) {
    console.error(e);
    bad(res, "Delete failed", 500);
  }
});

// Update ticket quantity
app.patch("/api/tickets/:id", async (req, res) => {
  try {
    if (!adminOK(req)) return bad(res, "Unauthorized", 401);
    const id = Number(req.params.id);
    const { quantity } = req.body || {};
    const qty = Number(quantity);
    if (!qty) return bad(res, "Quantity required");
    const { rows } = await pool.query(
      `UPDATE tickets SET quantity=$1 WHERE id=$2 RETURNING *`,
      [qty, id]
    );
    if (!rows.length) return notFound(res);
    ok(res, rows[0]);
  } catch (e) {
    console.error(e);
    bad(res, "Update failed", 500);
  }
});

// Delete a team member (remove from team_group)
app.delete("/api/teams/:team/:id", async (req, res) => {
  try {
    if (!adminOK(req)) return bad(res, "Unauthorized", 401);
    const { team, id } = req.params;
    await pool.query(
      `UPDATE players SET team_group=NULL WHERE id=$1 AND team_group=$2`,
      [id, team]
    );
    ok(res, { message: "Team member removed" });
  } catch (e) {
    console.error(e);
    bad(res, "Delete failed", 500);
  }
});

// Add a new team member (insert into players table with team flag)
app.post("/api/teams/:team", async (req, res) => {
  try {
    if (!adminOK(req)) return bad(res, "Unauthorized", 401);
    const { team } = req.params;
    const { name } = req.body;
    if (!name) return bad(res, "Name required");
    const { rows } = await pool.query(
      `INSERT INTO players(name,team,team_group) VALUES($1,true,$2) RETURNING id,name,team_group`,
      [name, team]
    );
    ok(res, rows[0]);
  } catch (e) {
    console.error(e);
    bad(res, "Add failed", 500);
  }
});

// Rename a team member
app.patch("/api/teams/:team/:id", async (req, res) => {
  try {
    if (!adminOK(req)) return bad(res, "Unauthorized", 401);
    const { id } = req.params;
    const { name } = req.body;
    if (!name) return bad(res, "Name required");
    const { rows } = await pool.query(
      `UPDATE players SET name=$1 WHERE id=$2 RETURNING id,name,team_group`,
      [name, id]
    );
    if (!rows.length) return notFound(res);
    ok(res, rows[0]);
  } catch (e) {
    console.error(e);
    bad(res, "Rename failed", 500);
  }
});
