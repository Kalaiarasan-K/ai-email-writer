import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Paper,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import EmailIcon from "@mui/icons-material/Email";
import PaletteIcon from "@mui/icons-material/Palette";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

function App() {
  const [emailContent, setEmailContent] = useState("");
  const [tone, setTone] = useState("");
  const [generatedReply, setGeneratedReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const [senderName, setSenderName] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [subject, setSubject] = useState("");
  const [includeNames, setIncludeNames] = useState(true);
  const [includeSignature, setIncludeSignature] = useState(true);
  const [keepFormatting, setKeepFormatting] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        "http://localhost:8080/api/email/generate",
        { emailContent,
          tone,
          senderName: senderName || undefined,
          receiverName: receiverName || undefined,
          subject: subject || undefined,
          includeNames,
          includeSignature,
          keepFormatting

        }
      );

      setGeneratedReply(
        typeof response.data === "string"
          ? response.data
          : JSON.stringify(response.data)
      );
    } catch (error) {
      setError("Failed to generate email reply. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedReply);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        py: 6,
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 20%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 20%)",
          pointerEvents: "none",
        },
      }}
    >
      {/* Animated background elements */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: `linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)`,
            top: `${20 + i * 30}%`,
            left: `${10 + i * 20}%`,
          }}
          animate={{
            y: [0, 30, 0],
            x: [0, 15, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20 + i * 5,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          <Box
            sx={{
              textAlign: "center",
              mb: 6,
              position: "relative",
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                border: "2px dashed rgba(255,255,255,0.3)",
              }}
            />
            
            <Box sx={{ position: "relative", zIndex: 1 }}>
              <EmailIcon
                sx={{
                  fontSize: 64,
                  color: "white",
                  mb: 2,
                  filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
                }}
              />
              <Typography
                variant="h2"
                fontWeight="800"
                sx={{
                  background: "linear-gradient(45deg, #ffffff 30%, #f0f0f0 90%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 1,
                  textShadow: "0 4px 8px rgba(0,0,0,0.1)",
                }}
              >
                AI Email Assistant
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: "rgba(255,255,255,0.9)",
                  fontWeight: 300,
                  letterSpacing: "0.5px",
                }}
              >
                Generate professional replies with perfect tone
              </Typography>
            </Box>
          </Box>
        </motion.div>

        <Box sx={{ display: "grid", gridTemplateColumns: { md: "1fr 1fr" }, gap: 4 }}>
          {/* Input Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Card
              sx={{
                borderRadius: 4,
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
                height: "100%",
                overflow: "hidden",
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <PaletteIcon
                    sx={{
                      color: "#667eea",
                      mr: 2,
                      fontSize: 28,
                    }}
                  />
                  <Typography variant="h5" fontWeight="600" color="#2D3748">
                    Compose Your Email
                  </Typography>
                </Box>

                <TextField
                  fullWidth
                  multiline
                  rows={8}
                  label={
                    <Typography variant="body2" fontWeight="500">
                      Original Email Content
                    </Typography>
                  }
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                  sx={{
                    mb: 3,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: "0 4px 12px rgba(102, 126, 234, 0.1)",
                      },
                      "&.Mui-focused": {
                        boxShadow: "0 4px 20px rgba(102, 126, 234, 0.15)",
                      },
                    },
                  }}
                  placeholder="Paste the email you want to reply to..."
                />

                <FormControl fullWidth sx={{ mb: 4 }}>
                  <InputLabel sx={{ fontWeight: 500 }}>Select Tone</InputLabel>
                  <Select
                    value={tone}
                    label="Select Tone"
                    onChange={(e) => setTone(e.target.value)}
                    sx={{
                      borderRadius: 3,
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(102, 126, 234, 0.3)",
                      },
                    }}
                  >
                    <MenuItem value="">
                      <em>Auto-detect</em>
                    </MenuItem>
                    <MenuItem value="professional">
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            bgcolor: "#4CAF50",
                            mr: 1.5,
                          }}
                        />
                        Professional
                      </Box>
                    </MenuItem>
                    <MenuItem value="casual">
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            bgcolor: "#2196F3",
                            mr: 1.5,
                          }}
                        />
                        Casual
                      </Box>
                    </MenuItem>
                    <MenuItem value="friendly">
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            bgcolor: "#FF9800",
                            mr: 1.5,
                          }}
                        />
                        Friendly
                      </Box>
                    </MenuItem>
                    <MenuItem value="formal">
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            bgcolor: "#9C27B0",
                            mr: 1.5,
                          }}
                        />
                        Formal
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>

                {/* New optional fields */}
                <TextField
                  fullWidth
                  label="Sender's Name (optional)"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  sx={{ mb: 2, borderRadius: 3 }}
                  placeholder="Your name"
                />

                <TextField
                  fullWidth
                  label="Receiver's Name (optional)"
                  value={receiverName}
                  onChange={(e) => setReceiverName(e.target.value)}
                  sx={{ mb: 2, borderRadius: 3 }}
                  placeholder="Recipient's name"
                />

                <TextField
                  fullWidth
                  label="Email Subject (optional)"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  sx={{ mb: 3, borderRadius: 3 }}
                  placeholder="Original email Subject"
                />

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={includeNames}
                        onChange={(e) => setIncludeNames(e.target.checked)}
                        color="primary"
                      />}
                    label="Include names"
                  />

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={includeSignature}
                        onChange={(e) => setIncludeSignature(e.target.checked)}
                        color="primary"
                      />}
                    label="Include signature"
                  />

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={keepFormatting}
                        onChange={(e) => setKeepFormatting(e.target.checked)}
                        color="primary"
                      />}
                    label="Keep formatting"
                  />
                </Box>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={!emailContent || loading}
                    fullWidth
                    startIcon={
                      loading ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <AutoAwesomeIcon />
                      )
                    }
                    sx={{
                      py: 1.5,
                      borderRadius: 3,
                      fontSize: "1rem",
                      textTransform: "none",
                      fontWeight: 600,
                      background: "linear-gradient(45deg, #667eea 0%, #764ba2 100%)",
                      boxShadow: "0 4px 14px rgba(102, 126, 234, 0.4)",
                      "&:hover": {
                        boxShadow: "0 6px 20px rgba(102, 126, 234, 0.6)",
                        background: "linear-gradient(45deg, #5a6fd8 0%, #6a4190 100%)",
                      },
                      "&:disabled": {
                        background: "rgba(102, 126, 234, 0.3)",
                      },
                    }}
                  >
                    {loading ? "Generating..." : "Generate Smart Reply"}
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>


          {/* Output Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Card
              sx={{
                borderRadius: 4,
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
                height: "100%",
                overflow: "hidden",
              }}
            >
              <CardContent sx={{ p: 4, height: "100%" }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <AutoAwesomeIcon
                    sx={{
                      color: "#764ba2",
                      mr: 2,
                      fontSize: 28,
                    }}
                  />
                  <Typography variant="h5" fontWeight="600" color="#2D3748">
                    Generated Reply
                  </Typography>
                </Box>

                <AnimatePresence mode="wait">
                  {generatedReply ? (
                    <motion.div
                      key="reply"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Paper
                        sx={{
                          p: 3,
                          borderRadius: 3,
                          bgcolor: "rgba(248, 250, 252, 0.8)",
                          border: "1px solid rgba(102, 126, 234, 0.1)",
                          height: "calc(100% - 120px)",
                          overflow: "auto",
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            whiteSpace: "pre-wrap",
                            lineHeight: 1.8,
                            color: "#2D3748",
                          }}
                        >
                          {generatedReply}
                        </Typography>
                      </Paper>
                      
                      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            variant="outlined"
                            startIcon={copied ? <CheckCircleIcon /> : <ContentCopyIcon />}
                            onClick={handleCopy}
                            sx={{
                              borderRadius: 3,
                              textTransform: "none",
                              fontWeight: 500,
                              borderColor: "#667eea",
                              color: "#667eea",
                              "&:hover": {
                                borderColor: "#5a6fd8",
                                background: "rgba(102, 126, 234, 0.04)",
                              },
                            }}
                          >
                            {copied ? "Copied!" : "Copy Reply"}
                          </Button>
                        </motion.div>
                        
                        <Typography
                          variant="caption"
                          sx={{
                            color: "rgba(102, 126, 234, 0.7)",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <AutoAwesomeIcon sx={{ fontSize: 12, mr: 0.5 }} />
                          AI Generated Content
                        </Typography>
                      </Box>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="placeholder"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      style={{ height: "100%" }}
                    >
                      <Box
                        sx={{
                          height: "calc(100% - 60px)",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          textAlign: "center",
                          color: "rgba(102, 126, 234, 0.4)",
                        }}
                      >
                        <EmailIcon sx={{ fontSize: 64, mb: 2 }} />
                        <Typography variant="h6" color="inherit" gutterBottom>
                          Your generated reply will appear here
                        </Typography>
                        <Typography variant="body2" color="inherit">
                          Enter an email and select a tone to generate a professional reply
                        </Typography>
                      </Box>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </Box>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Paper
                sx={{
                  mt: 4,
                  p: 2,
                  borderRadius: 3,
                  background: "rgba(254, 202, 202, 0.9)",
                  border: "1px solid #FCA5A5",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: "#DC2626",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ⚠️ {error}
                </Typography>
              </Paper>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <Typography
            variant="caption"
            sx={{
              display: "block",
              textAlign: "center",
              mt: 6,
              color: "rgba(255, 255, 255, 0.7)",
              letterSpacing: "0.5px",
            }}
          >
            Powered by AI • Professional email replies at your fingertips
          </Typography>
        </motion.div>
      </Container>
    </Box>
  );
}

export default App;