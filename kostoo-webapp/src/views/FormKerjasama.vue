<template>
  <div class="container">
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

      <p>Ajukan Kerjasama dengan Desa {{ detail_desa.nama_desa }}</p>
    </div>
    <!-- end of judul and back button -->

    <!-- form -->
    <div class="list-form">
      <div class="sub-form">
        <p class="judul-input">
          Nama Proyek
        </p>
        <input type="text" v-model="form_kerjasama.nama_proyek" />
      </div>

      <div class="sub-form">
        <p class="judul-input">
          Deskripsi Proyek
        </p>
        <textarea
          name=""
          id=""
          cols="30"
          v-model="form_kerjasama.deskripsi_proyek"
        ></textarea>
      </div>

      <div class="sub-form">
        <p class="judul-input">
          Harga Proyek
        </p>
        <input v-model="form_kerjasama.harga_proyek" type="number" />
      </div>

      <div class="sub-form">
        <p class="judul-input">
          Batas Waktu Pengerjaan
        </p>
        <input v-model="form_kerjasama.deadline_proyek" type="date" />
      </div>

      <div class="sub-form">
        <p class="judul-input">
          Detail Proyek
        </p>
        <input @change="handleFileChange" type="file" />
      </div>
    </div>
    <!-- end of form -->

    <div style="text-align:center">
      <button class="orange-button" @click="ajukanProyek">Ajukan</button>
    </div>
  </div>
</template>

<script>
import firebase from "../firebase";
import { mapState } from "vuex";

export default {
  data() {
    return {
      form_kerjasama: {
        nama_proyek: "",
        deskripsi_proyek: "",
        deadline_proyek: "",
        harga_proyek: "",
        detail_proyek: ""
      },
      detail_desa: []
    };
  },
  methods: {
    async ajukanProyek() {
      if (
        !(
          this.form_kerjasama.nama_proyek == "" ||
          this.form_kerjasama.deskripsi_proyek == "" ||
          this.form_kerjasama.deadline_proyek == "" ||
          this.form_kerjasama.harga_proyek == "" ||
          this.form_kerjasama.detail_proyek == ""
        )
      ) {
        let noErrorFound = true;
        let deadlineDate = new Date(this.form_kerjasama.deadline_proyek);
        deadlineDate.setHours(23, 59, 0, 0);
        let data = {
          nama_proyek: this.form_kerjasama.nama_proyek,
          deskripsi_proyek: this.form_kerjasama.deskripsi_proyek,
          deadline_proyek: deadlineDate,
          harga_proyek: this.form_kerjasama.harga_proyek,
          status_proyek: "waiting",
          desa: firebase.db.collection("users").doc(this.$route.params.id),
          investor: firebase.db.collection("users").doc(this.currentUser.uid),
          tanggal_diajukan: new Date(),
          progress: [],
          pengajuan_pembatalan: ""
        };

        let addedData;
        try {
          addedData = await firebase.db.collection("proyek").add(data);
        } catch (error) {
          noErrorFound = false;
          console.error(error);
          alert(error);
        }
        if (noErrorFound) {
          try {
            let ref = await firebase.storage
              .ref()
              .child("/proyek/" + addedData.id + ".pdf");
            let task = await ref.put(this.form_kerjasama.detail_proyek);
          } catch (error) {
            console.log(error);
          }
          this.$router.push("/investor");
        }
      }
    },
    handleFileChange(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length) {
        return;
      }
      if (!files[0].type.includes("pdf")) {
        this.form_kerjasama.detail_proyek = "";
      } else {
        this.form_kerjasama.detail_proyek = files[0];
      }
    },
    back() {
      this.$router.go(-1);
    }
  },
  computed: {
    ...mapState(["currentUser"])
  },
  watch: {
    get_detail_desa: {
      immediate: true,
      handler() {
        this.$bind(
          "detail_desa",
          firebase.db.collection("users").doc(this.$route.params.id)
        );
      }
    }
  },
  async beforeRouteEnter(to, from, next) {
    let doc;
    try {
      doc = await firebase.db
        .collection("users")
        .doc(to.params.id)
        .get();
    } catch (error) {
      console.error(error);
    }
    let data = doc.data();
    if (!doc.exists) {
      next("/investor");
    } else if (data.role == "investor") {
      next("/investor");
    } else {
      next();
    }
  }
};
</script>

<style scoped>
@import url("../assets/css/form.css");
</style>
