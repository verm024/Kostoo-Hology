<template>
  <div class="container" v-if="data_proyek">
    <!-- judul and back button -->
    <div class="judul-dan-back">
      <svg
        @click="back"
        width="20"
        height="28"
        viewBox="0 0 12 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9.7166 20L12 17.65L4.583 10L12 2.35L9.7166 0L0 10L9.7166 20Z"
          fill="#EC6B2A"
        />
      </svg>

      <p>{{ data_proyek.nama_proyek }}</p>
    </div>
    <!-- end of judul and back button -->

    <!-- card informasi proyek-->
    <div class="list-card-proyek">
      <div class="card-deadline">
        <div
          class="hari-tersisa"
          v-if="data_proyek.status_proyek != 'finished'"
        >
          <h3 v-if="Date.now() / 1000 < data_proyek.deadline_proyek.seconds">
            {{
              Math.floor(
                Math.floor(
                  data_proyek.deadline_proyek.seconds - Date.now() / 1000
                ) / 86400
              )
            }}
          </h3>
          <h3 class="orange-color" v-else>
            {{
              Math.floor(
                Math.floor(
                  Date.now() / 1000 - data_proyek.deadline_proyek.seconds
                ) / 86400
              )
            }}
          </h3>
          <p>
            Hari <br />
            <span
              v-if="Date.now() / 1000 < data_proyek.deadline_proyek.seconds"
            >
              Tersisa
            </span>
            <span v-else>
              Terlewat
            </span>
          </p>
        </div>
        <div class="hari-tersisa" v-else>
          <h3
            v-if="
              data_proyek.tanggal_selesai.seconds <
                data_proyek.deadline_proyek.seconds
            "
          >
            {{
              Math.floor(
                Math.floor(
                  data_proyek.deadline_proyek.seconds -
                    data_proyek.tanggal_selesai.seconds
                ) / 86400
              )
            }}
          </h3>
          <h3 class="orange-color" v-else>
            {{
              Math.floor(
                Math.floor(
                  data_proyek.tanggal_selesai.seconds -
                    data_proyek.deadline_proyek.seconds
                ) / 86400
              )
            }}
          </h3>
          <p>
            Hari <br />
            <span
              v-if="
                data_proyek.tanggal_selesai.seconds <
                  data_proyek.deadline_proyek.seconds
              "
            >
              Lebih Cepat
            </span>
            <span v-else>
              Terlambat
            </span>
          </p>
        </div>
        <p class="tanggal-deadline">
          Deadline : {{ formatDate(data_proyek.deadline_proyek.seconds) }}
        </p>
      </div>

      <div
        class="card-mou"
        v-if="data_proyek.status_proyek != 'waiting' && checkUser()"
        @click="handleClickMou"
      >
        <div class="text-card">
          <p class="judul">MoU Kerjasama</p>
          <p class="tanggal-mou">
            {{ formatDate(data_proyek.tanggal_mou.seconds) }}
          </p>
        </div>
        <span>
          <svg
            width="14"
            height="18"
            viewBox="0 0 8 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.41 0L0 1.41L4.58 6L0 10.59L1.41 12L7.41 6L1.41 0Z"
              fill="#EC6B2A"
            /></svg
        ></span>
      </div>
    </div>
    <!-- end of card informasi proyek-->

    <!-- pihak terlibat -->
    <div id="pihak-terlibat">
      <p v-if="data_proyek.investor.nama_perusahaan">
        <span style="font-weight:bold">{{
          data_proyek.investor.nama_perusahaan
        }}</span>
        sebagai Investor
      </p>
      <p v-if="data_proyek.desa.nama_desa">
        <span style="font-weight:bold">{{ data_proyek.desa.nama_desa }}</span>
        sebagai Desa
      </p>
    </div>

    <div style="text-align:center">
      <button
        class="orange-button"
        v-if="userProfile.role == 'investor' && checkUser()"
        @click="handleClickHubungi"
      >
        Hubungi Desa
      </button>
      <button
        class="orange-button"
        v-if="userProfile.role == 'desa' && checkUser()"
        @click="handleClickHubungi"
      >
        Hubungi Investor
      </button>
    </div>
    <!-- end of pihak terlibat -->

    <!-- deskripsi proyek -->
    <div class="deskripsi-proyek">
      <p class="judul-text">Deskripsi Proyek</p>
      <p class="deskripsi">
        {{ data_proyek.deskripsi_proyek }}
      </p>
    </div>
    <!-- end of deskripsi proyek -->

    <!-- detail proyek -->
    <div class="deskripsi-proyek">
      <p class="judul-text">Detail Proyek</p>
      <p class="deskripsi">
        <a class="download-button" :href="file_proyek.detail_proyek">
          <svg
            id="bold"
            enable-background="new 0 0 24 24"
            height="22"
            viewBox="0 0 24 24"
            width="22"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#ffffff"
              d="m12 16c-.205 0-.401-.084-.542-.232l-5.25-5.5c-.455-.476-.117-1.268.542-1.268h2.75v-5.75c0-.689.561-1.25 1.25-1.25h2.5c.689 0 1.25.561 1.25 1.25v5.75h2.75c.659 0 .997.792.542 1.268l-5.25 5.5c-.141.148-.337.232-.542.232z"
            />
            <path
              fill="#ffffff"
              d="m22.25 22h-20.5c-.965 0-1.75-.785-1.75-1.75v-.5c0-.965.785-1.75 1.75-1.75h20.5c.965 0 1.75.785 1.75 1.75v.5c0 .965-.785 1.75-1.75 1.75z"
            />
          </svg>

          Download</a
        >
      </p>
    </div>
    <!-- end of detail proyek -->

    <!-- Status Proyek proyek -->
    <div class="deskripsi-proyek">
      <p class="judul-text">Status Proyek</p>
      <p class="deskripsi">
        {{ menentukanStatus(data_proyek.status_proyek) }}
      </p>
    </div>
    <!-- end of status proyek -->

    <!-- progress proyek -->
    <div
      class="progress-proyek"
      v-if="
        !(
          data_proyek.status_proyek == 'waiting' ||
          data_proyek.status_proyek == 'waiting2'
        )
      "
    >
      <p class="judul-text">Progress Proyek</p>
      <p class="deskripsi" v-if="data_proyek.progress.length == 0">
        Belum ada progress
      </p>

      <div class="list-content-progress">
        <div
          :key="index"
          v-for="(progress, index) in data_proyek.progress"
          class="content-progress"
        >
          <div class="counter-progress">
            <span>{{ index + 1 }}</span>
          </div>

          <div class="yang-dilakukan">
            <p class="judul">{{ progress.nama_progress }}</p>
            <p class="deskripsi">
              {{ progress.deskripsi_progress }} <br />
              pada tanggal
              {{ formatDate(progress.tanggal_progress.seconds) }}
            </p>
            <p style="margin-top:8px;color:#333333" class="deskripsi">
              Pengeluaran : {{ formatCurrency(progress.harga_progress) }}
            </p>
            <p
              style="margin-top:-16px;color:#EC6B2A"
              class="deskripsi"
              @click="() => handleClickBukti(progress.bukti_progress)"
            >
              Bukti
            </p>
          </div>
        </div>
      </div>
      <div style="display: flex;align-items: center;justify-content:center">
        <div
          v-if="
            data_proyek.status_proyek == 'ongoing' &&
              data_proyek.pengajuan_pembatalan == userProfile.role &&
              checkUser()
          "
        >
          <button
            style="font-weight:500;color:#EC6B2A;background:white"
            class="orange-button"
            @click="batalkanPengajuan"
          >
            Batalkan pengajuan pembatalan
          </button>
        </div>

        <button
        style="margin-left:-19px;margin-right:20px"
          @click="openCloseFormUpdate"
          v-if="
            userProfile.role == 'desa' &&
              data_proyek.status_proyek == 'ongoing' &&
              checkUser()
          "
          class="orange-button"
        >
          Perbarui Progress
        </button>

        <!-- Temporary selesaikan proyek -->
        <div
          class="proyek-selesai-button"
          v-if="
            data_proyek.status_proyek == 'ongoing' &&
              userProfile.role == 'desa' &&
              data_proyek.pengajuan_pembatalan == '' &&
              checkUser()
          "
        >
          <button @click="selesaikanProyek">Selesai</button>
        </div>

        <!-- end of Temporary selesaikan proyek -->
      </div>
    </div>

    <!-- end of progress proyek -->

    <!-- tambah MOU dan setujui proyek (desa) -->

    <div
      v-if="
        userProfile.role == 'desa' &&
          data_proyek.status_proyek == 'waiting' &&
          checkUser()
      "
      class="deskripsi-proyek"
    >
      <p class="judul-text">Upload MoU dan Konfirmasi</p>
      <div>
        <!-- input file -->
        <input @change="handleFileChange" type="file" id="actual-btn" hidden />

        <!-- Button upload -->
        <label for="actual-btn">Upload MoU</label>

        <!-- nama file -->
        <span class="deskripsi" id="file-chosen">Belum upload file</span>

        <div style="text-align:center;margin-top:24px">
          <button class="orange-button" @click="setujuiProyek">
            Konfirmasi Proyek
          </button>
        </div>
      </div>
    </div>

    <!-- end of tambah MOU dan setujui proyek (desa) -->

    <!-- konfirmasi proyek (investor) -->
    <div
      id="button-konfirmasi-mou"
      v-if="
        userProfile.role == 'investor' &&
          data_proyek.status_proyek == 'waiting2' &&
          checkUser()
      "
    >
      <button class="setuju" @click="setujuiMou">Setujui</button>
      <button class="tolak" @click="tolakMou">Tolak</button>
    </div>
    <!-- end of konfirmasi proyek (investor) -->

    <!-- tambah progress -->
    <div style="top:100%" ref="boxProgress" class="black-background">
      <div class="form-update-progress">
        <div style="padding:8px 22px" class="list-form">
          <div class="sub-form">
            <p class="judul-input">
              Judul
            </p>
            <input
              type="text"
              v-model="form_progress.nama_progress"
              placeholder="Nama progress"
            />
          </div>

          <div class="sub-form">
            <p class="judul-input">
              Deskripsi
            </p>
            <input
              type="text"
              v-model="form_progress.deskripsi_progress"
              placeholder="Deskripsi progress"
            />
          </div>

          <div class="sub-form">
            <p class="judul-input">
              Tanggal
            </p>
            <input
              type="date"
              v-model="form_progress.tanggal_progress"
              placeholder="Tanggal progress"
            />
          </div>

          <div class="sub-form">
            <p class="judul-input">
              Biaya
            </p>
            <input
              type="number"
              v-model="form_progress.harga_progress"
              placeholder="Total Pengeluaran"
            />
          </div>

          <div class="sub-form">
            <p class="judul-input">
              URL Bukti
            </p>
            <input
              type="text"
              v-model="form_progress.bukti_progress"
              placeholder="http://www.example.com"
            />
          </div>

          <div style="text-align:center;margin-top:20px">
            <button class="orange-button" @click="tambahProgress">
              Perbarui progress
            </button>

            <button
              @click="openCloseFormUpdate"
              style="color:#EC6B2A;background:white"
              class="orange-button"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- end of tambah progress -->

    <!-- Temporary ajukan pembatalan -->
    <div
      class="ajukan-pembatalan"
      v-if="
        data_proyek.status_proyek == 'ongoing' &&
          data_proyek.pengajuan_pembatalan == '' &&
          checkUser()
      "
    >
      <button @click="() => ajukanPembatalan(userProfile.role)">
        Ajukan Pembatalan
      </button>
    </div>

    <div
      style="text-align:center"
      v-if="
        data_proyek.status_proyek == 'ongoing' &&
          data_proyek.pengajuan_pembatalan != '' &&
          data_proyek.pengajuan_pembatalan != userProfile.role &&
          checkUser()
      "
    >
      <button
        style="background:#e73c51"
        class="orange-button"
        @click="terimaPengajuan"
      >
        Terima pengajuan pembatalan
      </button>
    </div>
    <!-- end of ajukan pembatalan -->
  </div>
</template>

<script>
import firebase from "../firebase";
import { mapState } from "vuex";
import currencyFormatter from "currency-formatter";
import validator from "validator";

export default {
  data() {
    return {
      data_proyek: "",
      form_progress: {
        nama_progress: "",
        deskripsi_progress: "",
        tanggal_progress: "",
        harga_progress: "",
        bukti_progress: ""
      },
      file_proyek: {
        detail_proyek: "",
        mou_proyek: ""
      },
      form_konfirmasi: {
        mou_proyek: ""
      },
      namaFileMou: null
    };
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    checkUser() {
      if (this.userProfile.role == "investor") {
        if (this.currentUser.uid == this.data_proyek.investor.id) {
          return true;
        } else {
          return false;
        }
      } else {
        if (this.currentUser.uid == this.data_proyek.desa.id) {
          return true;
        } else {
          return false;
        }
      }
    },
    menentukanStatus(status) {
      if (status === `waiting`) return "Sedang Menunggu Konfirmasi..";
      if (status === "waiting2")
        return "MoU telah diupload, sedang menunggu konfirmasi..";
      if (status === "ongoing") return "Sedang dalam pengerjaan..";
      if (status === "finished") return "Telah selesai dilaksanakan..";
      else return "Proyek dibatalkan";
    },

    formatDate(timestamp) {
      let date = new Date(timestamp * 1000);
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      date = date.getDate();
      return date + "/" + month + "/" + year;
    },
    async tambahProgress() {
      if (
        !(
          this.form_progress.nama_progress == "" ||
          this.form_progress.deskripsi_progress == "" ||
          this.form_progress.tanggal_progress == "" ||
          this.form_progress.harga_progress == "" ||
          this.form_progress.bukti_progress == "" ||
          !validator.isURL(this.form_progress.bukti_progress) ||
          !(
            this.form_progress.bukti_progress.includes("http://") ||
            this.form_progress.bukti_progress.includes("https://")
          )
        )
      ) {
        let currentProgress = this.data_proyek.progress;
        for (let i = 0; i < currentProgress.length; i++) {
          currentProgress[i].tanggal_progress = new Date(
            currentProgress[i].tanggal_progress.seconds * 1000
          );
        }
        let dataProgress = {
          nama_progress: this.form_progress.nama_progress,
          deskripsi_progress: this.form_progress.deskripsi_progress,
          tanggal_progress: new Date(this.form_progress.tanggal_progress),
          harga_progress: this.form_progress.harga_progress,
          bukti_progress: this.form_progress.bukti_progress
        };
        currentProgress.push(dataProgress);
        currentProgress.sort((a, b) => {
          return a.tanggal_progress - b.tanggal_progress;
        });
        try {
          await firebase.db
            .collection("proyek")
            .doc(this.$route.params.id)
            .update({ progress: currentProgress });
          this.form_progress.nama_progress = "";
          this.form_progress.deskripsi_progress = "";
          this.form_progress.tanggal_progress = "";
          this.form_progress.harga_progress = "";
          this.form_progress.bukti_progress = "";
          this.openCloseFormUpdate();
        } catch (error) {
          console.error(error);
        }
      } else {
        alert("Harap isi form progress sesuai dengan format yang ada!");
      }
    },
    async setujuiProyek() {
      if (this.form_konfirmasi.mou_proyek != "") {
        let ref = firebase.storage
          .ref()
          .child("/mou/" + this.$route.params.id + ".pdf");
        try {
          let task = await ref.put(this.form_konfirmasi.mou_proyek);
          await firebase.db
            .collection("proyek")
            .doc(this.$route.params.id)
            .update({ status_proyek: "waiting2", tanggal_mou: new Date() });
        } catch (error) {
          console.error(error);
        }
      }
    },
    async tolakProyek() {
      try {
        await firebase.db
          .collection("proyek")
          .doc(this.$route.params.id)
          .update({
            status_proyek: "canceled",
            tanggal_dibatalkan: new Date()
          });
      } catch (error) {
        console.error(error);
      }
    },
    async setujuiMou() {
      try {
        await firebase.db
          .collection("proyek")
          .doc(this.$route.params.id)
          .update({ status_proyek: "ongoing", tanggal_diterima: new Date() });
      } catch (error) {
        console.error(error);
      }
    },
    async tolakMou() {
      try {
        let alert = confirm("Apakah kamu yakin ?");
        if (alert) {
          await firebase.db
            .collection("proyek")
            .doc(this.$route.params.id)
            .update({ status_proyek: "waiting" });
        } else return;
      } catch (error) {
        console.error(error);
      }
    },
    async selesaikanProyek() {
      try {
        let alert = confirm("Apakah kamu yakin ?");
        if (alert) {
          await firebase.db
            .collection("proyek")
            .doc(this.$route.params.id)
            .update({ status_proyek: "finished", tanggal_selesai: new Date() });
        } else return;
      } catch (error) {
        console.error(error);
      }
    },
    async ajukanPembatalan(role) {
      try {
        let alert = confirm("Apakah kamu yakin ?");
        if (alert) {
          await firebase.db
            .collection("proyek")
            .doc(this.$route.params.id)
            .update({ pengajuan_pembatalan: role });
        } else return;
      } catch (error) {
        console.error(error);
      }
    },
    async batalkanPengajuan() {
      try {
        await firebase.db
          .collection("proyek")
          .doc(this.$route.params.id)
          .update({ pengajuan_pembatalan: "" });
      } catch (error) {
        console.error(error);
      }
    },
    async terimaPengajuan() {
      try {
        await firebase.db
          .collection("proyek")
          .doc(this.$route.params.id)
          .update({
            status_proyek: "canceled",
            tanggal_dibatalkan: new Date()
          });
      } catch (error) {
        console.error(error);
      }
    },
    handleClickBukti(url) {
      window.location.href = url;
    },
    handleFileChange(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length) {
        return;
      }
      if (!files[0].type.includes("pdf")) {
        this.form_konfirmasi.mou_proyek = "";
      } else {
        this.form_konfirmasi.mou_proyek = files[0];
        document.getElementById("file-chosen").innerHTML = files[0].name;
      }
    },
    async handleClickHubungi() {
      let data;
      try {
        if (this.userProfile.role == "investor") {
          data = await firebase.db
            .collection("pesan")
            .where(
              "desa",
              "==",
              firebase.db.collection("users").doc(this.data_proyek.desa.id)
            )
            .where(
              "investor",
              "==",
              firebase.db.collection("users").doc(this.currentUser.uid)
            )
            .get();
        } else {
          data = await firebase.db
            .collection("pesan")
            .where(
              "investor",
              "==",
              firebase.db.collection("users").doc(this.data_proyek.investor.id)
            )
            .where(
              "desa",
              "==",
              firebase.db.collection("users").doc(this.currentUser.uid)
            )
            .get();
        }
      } catch (error) {
        console.error(error);
      }
      if (data.docs.length > 0) {
        this.$router.push("/pesan/" + data.docs[0].id);
      } else {
        let room;
        try {
          if (this.userProfile.role == "investor") {
            room = await firebase.db.collection("pesan").add({
              desa: firebase.db
                .collection("users")
                .doc(this.data_proyek.desa.id),
              investor: firebase.db
                .collection("users")
                .doc(this.currentUser.uid),
              tanggal_pesan: new Date()
            });
          } else {
            room = await firebase.db.collection("pesan").add({
              investor: firebase.db
                .collection("users")
                .doc(this.data_proyek.investor.id),
              desa: firebase.db.collection("users").doc(this.currentUser.uid),
              tanggal_pesan: new Date()
            });
          }
        } catch (error) {
          console.error(error);
        }
        if (room) {
          this.$router.push("/pesan/" + room.id);
        } else {
          alert("Terjadi error, coba lagi nanti");
        }
      }
    },
    handleClickMou() {
      window.location.href = this.file_proyek.mou_proyek;
    },

    openCloseFormUpdate() {
      let box = this.$refs.boxProgress;
      if (box.style.top === "100%") box.style.top = 0;
      else box.style.top = "100%";
    },
    formatCurrency(number) {
      return currencyFormatter.format(number, {
        symbol: "Rp.",
        thousand: ",",
        precision: 0,
        format: "%s %v"
      });
    }
  },
  watch: {
    get_data_proyek: {
      immediate: true,
      handler() {
        this.$bind(
          "data_proyek",
          firebase.db.collection("proyek").doc(this.$route.params.id)
        );
      }
    }
  },

  computed: {
    ...mapState(["currentUser", "userProfile"])
  },
  async created() {
    let projectFound = true;
    let ref = firebase.storage
      .ref()
      .child("/proyek/" + this.$route.params.id + ".pdf");
    try {
      let url = await ref.getDownloadURL();
      this.file_proyek.detail_proyek = url;
    } catch (error) {
      console.error(error);
      projectFound = false;
    }
    if (projectFound) {
      if (this.data_proyek.status_proyek != "waiting") {
        ref = firebase.storage
          .ref()
          .child("/mou/" + this.$route.params.id + ".pdf");
        try {
          let url = await ref.getDownloadURL();
          this.file_proyek.mou_proyek = url;
        } catch (error) {
          console.error(error);
        }
      }
    } else {
      return this.$router.push("/" + this.userProfile.role);
    }
  }
};
</script>

<style scoped>
@import url("../assets/css/proyek.css");
label {
  background-color: #5bc77a;
  color: white;
  font-weight: 700;
  padding: 6px 16px;
  border-radius: 0.3rem;
  cursor: pointer;
  margin-top: 1rem;
}

#file-chosen {
  margin-left: 0.3rem;
  font-family: sans-serif;
}

.orange-color {
  color: #ec6b2a;
}
</style>
